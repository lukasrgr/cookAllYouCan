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
  late Future<List<ShoppingListItem>> shoppingList =
      getShoppingListForSelectedRange();
  List<String> list = <String>['Woche'];
  Map<List<int>, Map<String, String>> isChecked = new Map();
  String? firstDayOfWeek;
  String? lastDayOfWeek;
  bool showAdditionalInfo = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    final today = DateTime.now();
    firstDayOfWeek = DateFormat('yyyy-MM-dd')
        .format(today.subtract(Duration(days: today.weekday - 1)));

    lastDayOfWeek = DateFormat('yyyy-MM-dd').format(
        today.add(Duration(days: DateTime.daysPerWeek - today.weekday)));
    super.initState();
  }

  Future<List<ShoppingListItem>> getShoppingListForSelectedRange() async {
    List<ShoppingListItem> result = [];
    List<ShoppingListItem> shoppinglist = [];

    await supabase
        .from(ShoppingListItems().TABLENAME)
        .select(
            'name,amount,unit,shopping_list_from_recipes_id,date,id,status, shopping_list_from_recipes(recipe_name)')
        .gte('date', firstDayOfWeek)
        .lte('date', lastDayOfWeek)
        .then((value) async {
      for (var val in value) {
        shoppinglist.add(new ShoppingListItem(
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
            return new ShoppingListItem(
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

    // TODO sorting settings
    result.sort((a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()));
    return Future.value(result);
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
                  shoppingList = getShoppingListForSelectedRange();
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
                this.shoppingList =
                    getShoppingListForSelectedRange().then((value) {
                  snackbar.close();
                  return value;
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
              child: Column(children: [
        /// Dropdown

        FutureBuilder<List<ShoppingListItem>>(
            future: shoppingList,
            builder: (BuildContext context,
                AsyncSnapshot<List<ShoppingListItem>> snapshot) {
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
                    value: stateOfElement(data.name),
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

                      var snackbar =
                          showNotification(context, "Liste wird upgedated");
                      updateShoppingListItem(
                              value == true ? 'done' : 'undone', data.id!)
                          .then((value) => {snackbar.close(), value});
                    },

                    /// TODO: categorys
                    secondary: const Icon(Icons.hourglass_empty),
                  ));
                }
              }

              return Form(key: _formKey, child: Column(children: children));
            }),
        // FutureBuilder<List<ShoppingListItem>>(
        //     future: shoppingList,
        //     builder: (BuildContext context,
        //         AsyncSnapshot<List<ShoppingListItem>> snapshot) {

        //       List<Widget> children = [];

        //       // children.add()
        //       return Form(key: _formKey, child: Column(children: children));
        //     })
      ]))),

      /// Show Confirmation Button when changes were made
    ]);
  }

  Future<void> updateShoppingListItem(String status, List<int> ids) async {
    ids.forEach((id) async {
      await supabase
          .from(ShoppingListItems().TABLENAME)
          .update({"status": status}) //
          .match({"id": id})
          .select("id") //
          .whenComplete(() => {});
    });

    return Future.delayed(Duration(milliseconds: 50));
  }

/**
 * Checks State of SHoppingListItem
 * 
 * @returns the state of a shoppingListItem
 */
  bool stateOfElement(String name) {
    bool returnValue = false;
    isChecked.values.forEach((maps) {
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
}
