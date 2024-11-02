import 'dart:developer';

import 'package:cook_all_you_can/index/pages/calendar/calendar.dart';
import 'package:cook_all_you_can/index/pages/shared/database/table.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:cook_all_you_can/index/pages/shoppinglist/toolbar.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../shared/service/service.dart';
import '../../theme/theme.dart';

class ShoppingList extends StatefulWidget {
  const ShoppingList({super.key});

  @override
  State<ShoppingList> createState() => _ShoppingListState();
}

class _ShoppingListState extends State<ShoppingList> {
  final supabase = Supabase.instance.client;

  Map<List<int>, Map<String, String>> isChecked = new Map();
  Map<int, Map<String, String>> isGeneralShoppingList = new Map();
  List<TextEditingController> generalController =
      List.generate(1, (i) => TextEditingController());
  ScrollController test = new ScrollController();
  bool showAdditionalInfo = false;

  final _formKey = GlobalKey<FormState>();
  final _generalShoppingListformKey = GlobalKey<FormState>();

  late Future<List<ShoppingListItemFromRecipe>> shoppingList =
      getShoppingListFromRecipesForSelectedRange(
          DateHelper.startDate, DateHelper.endDate);
  late Future<List<ShoppingListItemFromGeneral>> generalShoppingList =
      getGeneralShoppingList();

  @override
  void initState() {
    super.initState();
  }

  Future<List<ShoppingListItemFromRecipe>>
      getShoppingListFromRecipesForSelectedRange(
          String startDate, String endDate) async {
    List<ShoppingListItemFromRecipe> result = [];
    List<ShoppingListItemFromRecipe> shoppinglist = [];

    await supabase
        .from(ShoppingListItems().TABLENAME)
        .select(
            'name,amount,unit,shopping_list_from_recipes_id,date,id,status,expiration_date,ingredient_id, shopping_list_from_recipes(recipe_name, expiration_date)')
        .gte('date', startDate)
        .lte('date', endDate)
        .match({'household_id': Service.user.household_id}).then((value) async {
      for (var val in value) {
        shoppinglist.add(new ShoppingListItemFromRecipe(
            val['shopping_list_from_recipes_id'],
            val['name'],
            val['amount'] is int
                ? (val['amount'] as int).toDouble()
                : val['amount'],
            val['unit'],
            val['date'],
            val['ingredient_id'],
            List.from([val['id'] as int]),
            val['status'],
            [
              val['shopping_list_from_recipes']["recipe_name"],
              val['shopping_list_from_recipes']['expiration_date'] ?? ""
            ]));
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
                element.ingredient_id,
                [...?element.id, ...?value.id],
                element.status,
                [
                  ...?element.recipe_name,
                  ...?value.recipe_name,
                  value.expiration_date ?? ""
                ].toSet().toList());
          });
          result[index] = product;
        } else {
          result.add(item);
        }
      }

      return Future.value(result);
    });

    // TODO sorting settings,and move into utils
    // result.sort((a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()));
    // result.sort(
    //     (a, b) => b.status!.toLowerCase().compareTo(a.status!.toLowerCase()));
    return Future.value(result);
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Padding(
          padding: EdgeInsets.fromLTRB(0, 20, 0, 20),
          child: ShoppingListToolbarWidget(
            callback: dateRangeCallback,
          )),
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
                          MyThemes.ThemedCircularProgressIndicator
                        ]));
                      }

                      children.add(Text(
                        "Einkaufsliste aus Rezepten",
                        style: TextStyle(
                            fontSize: 20, color: MyThemes.primaryColor),
                      ));

                      if (snapshot.hasData) {
                        if (snapshot.requireData.isEmpty) {
                          children.add(Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Nichts eingetragen",
                                style: TextStyle(
                                    fontSize: 12, color: Colors.white),
                              )));
                        } else {
                          children.add(Row(children: [
                            Checkbox(
                              value: showAdditionalInfo,
                              onChanged: ((bool? value) {
                                setState(() {
                                  showAdditionalInfo = value!;
                                });
                              }),
                              activeColor: Colors.transparent,
                              checkColor: MyThemes.primaryColor,
                            ),
                            Text("Zeige zusätzliche Informationen",
                                style: TextStyle(color: MyThemes.textColor)),
                          ]));
                        }

                        for (var data in snapshot.requireData) {
                          children.add(CheckboxListTile(
                            title: Wrap(
                                alignment: WrapAlignment.spaceBetween,
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
                                ? Column(children: [
                                    Text(
                                      data.recipe_name?.join(",") ?? data.date,
                                      style: TextStyle(
                                          color: MyThemes.textColor
                                              .withOpacity(0.5)),
                                    ),
                                    data.expiration_date != null &&
                                            data.expiration_date!.isNotEmpty
                                        ? Text("MHD: " + data.expiration_date!)
                                        : Container()
                                  ])
                                : null,
                            checkColor: MyThemes.primaryColor,
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
                            style: TextStyle(
                                fontSize: 20, color: MyThemes.primaryColor),
                          ),
                        ])
                      ];

                      if (!snapshot.hasData) {
                        return Center(child: Column());
                      }

                      if (snapshot.hasData) {
                        if (snapshot.requireData.isEmpty) {
                          //TODO center
                          children.add(Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Nichts eingetragen",
                                style: TextStyle(
                                    fontSize: 12, color: Colors.white),
                              )));
                        }

                        if (snapshot.requireData.isNotEmpty) {
                          children.add(Row(children: [
                            Checkbox(
                              value: showAdditionalInfo,
                              onChanged: ((bool? value) {
                                setState(() {
                                  showAdditionalInfo = value!;
                                });
                              }),
                              activeColor: Colors.transparent,
                              checkColor: MyThemes.primaryColor,
                            ),
                            Text("Zeige zusätzliche Informationen",
                                style: TextStyle(color: MyThemes.textColor)),
                          ]));
                        }
                        for (var data in snapshot.requireData) {
                          children.add(CheckboxListTile(
                              title: Wrap(
                                  alignment: WrapAlignment.spaceBetween,
                                  // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(children: [
                                      Text(data.name),
                                    ]),
                                  ]),
                              value: stateOfElement(
                                  data.name, isGeneralShoppingList),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              checkColor: MyThemes.primaryColor,
                              activeColor: Colors.transparent,
                              subtitle: showAdditionalInfo
                                  ? Text(
                                      data.expirationDate!,
                                      style: TextStyle(
                                          color: MyThemes.textColor
                                              .withOpacity(0.5)),
                                    )
                                  : null,
                              onChanged: (bool? value) {
                                var status = value == true ? 'done' : 'undone';
                                var expirationDate = null;
                                if (value == true) {
                                  setState(() {
                                    // isGeneralShoppingList[data.id] = {
                                    //   data.name: 'done',
                                    //   data.expirationDate
                                    // };
                                    showDialog(
                                        context: context,
                                        builder: (BuildContext context) {
                                          return buildAlertDialog(
                                              context, submitExpirationDate);
                                        }).then((_expirationDate) {
                                      if (_expirationDate == null) {
                                        isGeneralShoppingList[data.id] = {
                                          data.name: status,
                                        };
                                      } else {
                                        isGeneralShoppingList[data.id] = {
                                          data.name: status,
                                          data.expirationDate!: _expirationDate
                                        };
                                      }
                                      updateGeneralShoppingListItem(
                                          data.id, status, _expirationDate);

                                      expirationDate = _expirationDate;
                                    });
                                  });
                                } else {
                                  setState(() {
                                    isGeneralShoppingList[data.id] = {
                                      data.name: status
                                    };
                                  });

                                  updateGeneralShoppingListItem(
                                      data.id, status, expirationDate);
                                }

                                // TODO: cleanup
                              }));
                          // children.add(
                          //   TextFormField(
                          //       controller: new TextEditingController(),
                          //       autofillHints: [AutofillHints.username],
                          //       decoration: MyThemes.ThemedInputDecoration(
                          //           'Email',
                          //           'Email in form of abc@gmail.com')),
                          // );
                        }

                        for (var x = 0; x < generalController.length; x++) {
                          children.add(Row(
                            children: <Widget>[
                              IconButton(
                                onPressed: () => setState(
                                    () => {generalController.removeAt(x)}),
                                icon: const Icon(Icons.playlist_remove_outlined,
                                    size: 24),
                              ),
                              Flexible(
                                  fit: FlexFit.tight,
                                  child: TextFormField(
                                      style: TextStyle(color: Colors.white),
                                      controller: generalController[x],
                                      decoration:
                                          MyThemes.ThemedInputDecoration(
                                              "Item", ""),
                                      validator: (value) =>
                                          validateTextForm(value))),
                              IconButton(
                                onPressed: () {
                                  if (_generalShoppingListformKey.currentState!
                                      .validate()) {
                                    var snackbar = showNotification(context,
                                        "Allgemeine Einkaufsliste wird upgedated");

                                    submitGeneralShoppingList()
                                        .whenComplete(() => snackbar.close());
                                  }
                                },
                                icon: const Icon(
                                  Icons.send,
                                  size: 24,
                                ),
                              ),
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
                        ]),
                      );
                      ;

                      return Form(
                          key: _generalShoppingListformKey,
                          child: Column(children: children));
                    })
              ]))),
    ]);
  }

  Future<void> updateShoppingListItem(String status, List<int> ids) async {
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
 * @returns the state of a shoppingListItem, checked or non checked
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
        .select('*')
        .match({'household_id': Service.user.household_id})
        .then((values) {
          values.forEach((element) {
            String expiration_date = element['expiration_date'] ?? "";

            isGeneralShoppingList[element['id']] = {
              element['name']: element['status'],
              'expiration_date': element['expiration_date'] ?? ""
            };
            list.add(new ShoppingListItemFromGeneral(
                element['id'],
                element['name'],
                element['description'],
                element['status'],
                expiration_date));
          });
        })
        .catchError((err) => print(err))
        .whenComplete(() => list.sort(
            (a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase())));
    return Future.value(list);
  }

  Future<void> submitGeneralShoppingList() async {
    Service.user.household_id;

    generalController.forEach((element) async {
      await supabase
          .from(GeneralShoppingList().TABLENAME)
          .insert({
            "name": element.text,
            "description": "",
            "household_id": Service.user.household_id
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

  Future<void> updateGeneralShoppingListItem(
    int id,
    String status,
    String? expirationDate,
  ) async {
    await supabase
        .from(GeneralShoppingList().TABLENAME)
        .update({"status": status, "expiration_date": expirationDate})
        .match({"id": id, "household_id": Service.user.household_id})
        .select("id")
        .then((value) => this.generalShoppingList = getGeneralShoppingList())
        .whenComplete(
            () => this.generalShoppingList = getGeneralShoppingList());
    return Future.delayed(Duration(milliseconds: 50));
  }

  // Date range picker
  void dateRangeCallback(String startDate, String endDate) {
    var snackbar = showNotification(context, "Liste wird aktualisiert");

    setState(() {
      this.shoppingList =
          getShoppingListFromRecipesForSelectedRange(startDate, endDate)
              .whenComplete(() {
        this.generalShoppingList = getGeneralShoppingList().whenComplete(() {
          snackbar.close();
        });
      });
    });
  }

  // Expiration date callback
  void submitExpirationDate(String expirationDate) {}
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

buildAlertDialog(BuildContext context, Function(String mhd) callback) {
  var controller = new TextEditingController();
  final _formKey = GlobalKey<FormState>();
  return AlertDialog(
      content: Container(
        child: Form(
            key: _formKey,
            child: TextFormField(
                controller: controller,
                autofillHints: [AutofillHints.username],
                validator: (value) => validateDateString(value),
                decoration: MyThemes.ThemedInputDecoration(
                    'MHD (Mindesthaltbarkeitsdatum)',
                    'in Form of 2024-12-31'))),
      ),
      actions: [
        Row(
          children: [
            Column(
              children: [
                TextButton(
                  child: Text(
                    'Ja',
                    style: TextStyle(color: MyThemes.primaryColor),
                  ),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      callback(controller.text);
                      Navigator.of(context).pop(controller.text);
                    }
                  },
                ),
              ],
            ),
            Spacer(),
            Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  child: Text('Nein',
                      style: TextStyle(color: MyThemes.primaryColor)),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            )
          ],
        )
      ]);
}
