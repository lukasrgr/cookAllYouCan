import 'dart:developer';
import 'dart:io';

import 'package:cook_all_you_can/button.dart';
import 'package:cook_all_you_can/calendar/calendar.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:cook_all_you_can/shared/shared.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ShoppingList extends StatefulWidget {
  const ShoppingList({super.key});

  @override
  State<ShoppingList> createState() => _ShoppingListState();
}

class _ShoppingListState extends State<ShoppingList> {
  final supabase = Supabase.instance.client;
  String dropdownValue = 'Woche';
  late Future<List<ShoppingListItemFromRecipe>> shoppingList =
      getShoppingListFromRecipesForSelectedRange();

  late Future<List<ShoppingListItemFromGeneral>> generalShoppingList =
      getGeneralShoppingList();
  List<String> list = <String>['Woche'];
  Map<List<int>, Map<String, String>> isChecked = new Map();
  Map<int, Map<String, String>> isGeneralShoppingListChecked = new Map();
  late String firstDayOfWeek;
  late String lastDayOfWeek;
  bool showAdditionalInfo = false;
  final _formKey = GlobalKey<FormState>();
  final _generalShoppingListformKey = GlobalKey<FormState>();
  List<TextEditingController> generalController =
      List.generate(1, (i) => TextEditingController());

  ScrollController test = new ScrollController();

  @override
  void initState() {
    // TODO: datepicker
    final today = DateTime.now();
    firstDayOfWeek = DateFormat('yyyy-MM-dd')
        .format(today.subtract(Duration(days: today.weekday - 1)));

    lastDayOfWeek = DateFormat('yyyy-MM-dd').format(
        today.add(Duration(days: DateTime.daysPerWeek - today.weekday)));
    super.initState();
  }

  Future<List<ShoppingListItemFromRecipe>>
      getShoppingListFromRecipesForSelectedRange() async {
    List<ShoppingListItemFromRecipe> result = [];
    List<ShoppingListItemFromRecipe> shoppinglist = [];

    await supabase
        .from(ShoppingListItems().TABLENAME)
        .select(
            'name,amount,unit,shopping_list_from_recipes_id,date,id,status, shopping_list_from_recipes(recipe_name)')
        .gte('date', firstDayOfWeek)
        .lte('date', lastDayOfWeek)
        .then((value) async {
      for (var val in value) {
        shoppinglist.add(new ShoppingListItemFromRecipe(
            val['shopping_list_from_recipes_id'],
            val['name'],
            val['amount'] is int
                ? (val['amount'] as int).toDouble()
                : val['amount'],
            val['unit'],
            val['date'],
            List.from([val['id'] as int]),
            val['status'],
            [val['shopping_list_from_recipes']["recipe_name"]]));
      }
    }).whenComplete(() {
      shoppinglist.forEach((element) {
        isChecked.putIfAbsent(
            element.id!, () => {element.name: element.status!});
      });

      for (var item in shoppinglist) {
        bool duplicates = result
            .where((element) =>
                element.name == item.name && element.unit == item.unit)
            .isNotEmpty;
        if (duplicates) {
          var index = result.indexWhere((element) =>
              element.name.toLowerCase() == item.name.toLowerCase() &&
              element.unit == item.unit);
          var product = [item, result[index]].reduce((value, element) {
            return new ShoppingListItemFromRecipe(
                element.shopping_list_from_recipes_id,
                element.name,
                element.amount + value.amount,
                element.unit,
                element.date + " | " + value.date,
                [...?element.id, ...?value.id],
                element.status,
                [...?element.recipe_name, ...?value.recipe_name]
                    .toSet()
                    .toList());
          });
          result[index] = product;
        } else {
          result.add(item);
        }
      }
    });

    // TODO sorting settings,and move into utils
    result.sort((a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()));
    result.sort(
        (a, b) => b.status!.toLowerCase().compareTo(a.status!.toLowerCase()));
    return Future.delayed(Duration(milliseconds: 100), () => result);
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            DropdownButton<String>(
              value: dropdownValue,
              elevation: 16,
              style: const TextStyle(fontSize: 16),
              underline: Container(
                height: 2,
                width: 10,
              ),
              onChanged: (String? value) {
                // This is called when the user selects an item.
                setState(() {
                  dropdownValue = value!.toString();
                  shoppingList = getShoppingListFromRecipesForSelectedRange();
                });
              },
              items: list.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(
                      value + " " + firstDayOfWeek! + "-" + lastDayOfWeek!),
                );
              }).toList(),
            )
          ]),
      Row(children: [
        Checkbox(
            value: showAdditionalInfo,
            onChanged: ((bool? value) {
              setState(() {
                showAdditionalInfo = value!;
              });
            })),
        Text("Zeige zusätzliche Informationen"),
        Spacer(),
        Column(mainAxisAlignment: MainAxisAlignment.end, children: [
          TextButton(
            onPressed: () {
              setState(() {
                var snackbar =
                    showNotification(context, "Liste wird aktualisiert");

                this.shoppingList = getShoppingListFromRecipesForSelectedRange()
                    .whenComplete(() {
                  this.generalShoppingList =
                      getGeneralShoppingList().whenComplete(() {
                    snackbar.close();
                  });
                });
              });
            },
            child: Icon(
              Icons.refresh,
              color: primaryColor,
            ),
          )
        ])
      ]),

      Expanded(
          child: SingleChildScrollView(
              controller: test,
              child: Column(children: [
                FutureBuilder<List<ShoppingListItemFromRecipe>>(
                    future: shoppingList,
                    builder: (BuildContext context,
                        AsyncSnapshot<List<ShoppingListItemFromRecipe>>
                            snapshot) {
                      List<Widget> children = [];

                      if (!snapshot.hasData) {
                        return Center(
                            child: Column(children: [
                          Padding(
                              padding: EdgeInsets.symmetric(vertical: 20),
                              child: CircularProgressIndicator())
                        ]));
                      }

                      if (snapshot.hasData) {
                        if (snapshot.requireData.isEmpty) {
                          //TODO center
                          return Text(
                            "Es wurden keine Rezepte für diesen Zeitraum angelegt oder der Einkauf ist abgeschlossen.",
                            style: TextStyle(
                              color: primaryColor,
                            ),
                          );
                        }

                        children.add(Text(
                          "Einkaufsliste aus Rezepten",
                          style: TextStyle(fontSize: 20, color: primaryColor),
                        ));
                        for (var data in snapshot.requireData) {
                          children.add(CheckboxListTile(
                            title: Wrap(alignment: WrapAlignment.spaceBetween,
                                // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    children: [Text(data.name)],
                                  ),
                                  Column(
                                    children: [
                                      Text(data.amount.toStringAsFixed(2) +
                                          " " +
                                          data.unit)
                                    ],
                                  ),
                                ]),
                            value: stateOfElement(data.name, isChecked),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20)),
                            subtitle: showAdditionalInfo
                                ? Text(data.recipe_name?.join(",") ?? data.date)
                                : null,
                            checkColor: primaryColor,
                            activeColor: Colors.transparent,

                            onChanged: (bool? value) {
                              if (value == true) {
                                setState(() {
                                  if (data.id != null) {
                                    isChecked[data.id!] = {data.name: 'done'};
                                  }
                                });
                              } else {
                                setState(() {
                                  isChecked[data.id!] = {data.name: 'undone'};
                                });
                              }

                              var snackbar = showNotification(
                                  context, "Liste wird upgedated");
                              updateShoppingListItem(
                                      value == true ? 'done' : 'undone',
                                      data.id!)
                                  .then((value) => {snackbar.close(), value});
                            },

                            /// TODO: categorys
                            // secondary: const Icon(Icons.hourglass_empty),
                          ));
                        }
                      }

                      return Form(
                          key: _formKey, child: Column(children: children));
                    }),
                FutureBuilder<List<ShoppingListItemFromGeneral>>(
                    future: generalShoppingList,
                    builder: (BuildContext context,
                        AsyncSnapshot<List<ShoppingListItemFromGeneral>>
                            snapshot) {
                      List<Widget> children = [
                        Column(children: [
                          Divider(color: Colors.white),
                          Text(
                            "Allgemeine Einkaufsliste",
                            style: TextStyle(fontSize: 20, color: primaryColor),
                          ),
                        ])
                      ];

                      if (!snapshot.hasData) {
                        return Center(
                            child: Column(children: [
                          Padding(
                              padding: EdgeInsets.symmetric(vertical: 20),
                              child: CircularProgressIndicator())
                        ]));
                      }

                      if (snapshot.hasData) {
                        if (snapshot.requireData.isEmpty) {
                          //TODO center
                          children.add(Text(
                            "Es wurden keine Items auf die Einkaufsliste für diesen Zeitraum geschrieben.",
                            style: TextStyle(
                              color: primaryColor,
                            ),
                          ));
                        }

                        for (var data in snapshot.requireData) {
                          children.add(CheckboxListTile(
                              title: Wrap(alignment: WrapAlignment.spaceBetween,
                                  // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      children: [Text(data.name)],
                                    ),
                                  ]),
                              value: stateOfElement(
                                  data.name, isGeneralShoppingListChecked),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              checkColor: primaryColor,
                              activeColor: Colors.transparent,
                              onChanged: (bool? value) {
                                if (value == true) {
                                  setState(() {
                                    isGeneralShoppingListChecked[data.id] = {
                                      data.name: 'done'
                                    };
                                  });
                                } else {
                                  setState(() {
                                    isGeneralShoppingListChecked[data.id] = {
                                      data.name: 'undone'
                                    };
                                  });
                                }

                                // TODO: cleanup
                                updateGeneralShoppingListItem(data.id);
                              }));
                        }

                        for (var x = 0; x < generalController.length; x++) {
                          children.add(Row(
                            children: <Widget>[
                              IconButton(
                                onPressed: () => setState(
                                    () => {generalController.removeAt(x)}),
                                icon:
                                    const Icon(Icons.playlist_remove_outlined),
                              ),
                              Flexible(
                                  child: TextFormField(
                                      controller: generalController[x],
                                      decoration: const InputDecoration(
                                          border: OutlineInputBorder(),
                                          labelText: 'Item',
                                          isDense: true),
                                      validator: (value) =>
                                          validateTextForm(value))),
                            ],
                          ));
                        }
                      }
                      children.add(
                        Row(children: <Widget>[
                          Expanded(
                              flex: 0,
                              child: Align(
                                alignment: Alignment.bottomLeft,
                                child: IconButton(
                                  onPressed: () => setState(() {
                                    generalController
                                        .add(TextEditingController());
                                    test.animateTo(
                                        test.position.maxScrollExtent,
                                        curve: Curves.easeOut,
                                        duration: Duration(seconds: 1));
                                  }),
                                  icon: const Icon(Icons.playlist_add_outlined,
                                      size: 24),
                                ),
                              )),
                          Expanded(
                              child: Align(
                            alignment: Alignment.bottomRight,
                            child: IconButton(
                              onPressed: () {
                                if (_generalShoppingListformKey.currentState!
                                    .validate()) {
                                  var snackbar = showNotification(context,
                                      "Allgemeine Einkaufsliste wird upgedated");

                                  submitGeneralShoppingList()
                                      .whenComplete(() => snackbar.close());
                                }
                              },
                              icon: const Icon(Icons.send),
                            ),
                          )),
                        ]),
                      );
                      ;

                      return Form(
                          key: _generalShoppingListformKey,
                          child: Column(children: children));
                    })
              ]))),

      /// Show Confirmation Button when changes were made
    ]);
  }

  Future<void> updateShoppingListItem(String status, List<int> ids) async {
    final some = await shoppingList;
    ids.forEach((id) async {
      await supabase
          .from(ShoppingListItems().TABLENAME)
          .update({"status": status}) //
          .match({"id": id})
          .select("id") //
          .whenComplete(() async {});
    });

    return Future.delayed(Duration(milliseconds: 50));
  }

/**
 * Checks State of ShoppingListItem
 * 
 * @returns the state of a shoppingListItem
 */
  bool stateOfElement(String name, Map<dynamic, Map<String, String>> map) {
    bool returnValue = false;

    map.values.forEach((maps) {
      maps.forEach((key, value) {
        if (key == name) {
          switch (value) {
            case 'done':
              returnValue = true;
              break;
            case 'undone':
              returnValue = false;
              break;
          }
        }
      });
    });
    return returnValue;
  }

  Future<List<ShoppingListItemFromGeneral>> getGeneralShoppingList() async {
    List<ShoppingListItemFromGeneral> list = [];
    await supabase
        .from(GeneralShoppingList().TABLENAME)
        .select('id,name,description,status')
        .then((value) => {
              value.forEach((element) {
                isGeneralShoppingListChecked[element['id']] = {
                  element['name']: element['status']
                };
                // ].putIfAbsent(
                //     element['id'], () => {element['name']: element['status']});
                list.add(new ShoppingListItemFromGeneral(
                    element['id'],
                    element['name'],
                    element['description'],
                    element['status']));
              }),
            })
        .whenComplete(() => list.sort(
            (a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase())));
    return Future.value(list);
  }

  Future<void> submitGeneralShoppingList() async {
    generalController.forEach((element) async {
      await supabase
          .from(GeneralShoppingList().TABLENAME)
          .insert({
            "name": element.text,
            "description": "",
          })
          .select('id')
          .whenComplete(() {
            setState(() {
              generalController
                  .firstWhere((ctrl) => ctrl.text == element.text)
                  .clear();
              generalShoppingList = getGeneralShoppingList().whenComplete(() {
                test.animateTo(test.position.maxScrollExtent,
                    curve: Curves.easeOut, duration: Duration(seconds: 1));
              });
            });
          });
    });
  }

  Future<void> updateGeneralShoppingListItem(int id) async {
    await supabase
        .from(GeneralShoppingList().TABLENAME)
        .delete()
        .match({"id": id})
        .select("id")
        .whenComplete(
            () => this.generalShoppingList = getGeneralShoppingList());
    return Future.delayed(Duration(milliseconds: 50));
  }
}

class GeneralShoppingList extends DatabaseTable {
  @override
  String TABLENAME = "general_shopping_list";

  @override
  toJson(argument1, argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}
