import 'package:cook_all_you_can/calendar/calendar.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:cook_all_you_can/shared/shared.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../recipe/showRecipe.dart';

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
  List<String> isChecked = [];
  String? firstDayOfWeek;
  String? lastDayOfWeek;
  bool showAdditionalInfo = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    getShoppingListForSelectedRange();
  }

  Future<List<ShoppingListItem>> getShoppingListForSelectedRange() async {
    final today = DateTime.now();
    List<ShoppingListItem> shoppinglist = [];

    firstDayOfWeek = DateFormat('yyyy-MM-dd')
        .format(today.subtract(Duration(days: today.weekday - 1)));

    lastDayOfWeek = DateFormat('yyyy-MM-dd').format(
        today.add(Duration(days: DateTime.daysPerWeek - today.weekday)));

    await supabase
        .from(ShoppingListItems().TABLENAME)
        .select('name,amount,unit,shopping_list_from_recipes_id,date')
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
        ));
      }
    });

    List<ShoppingListItem> result = [];

    for (var item in shoppinglist) {
      bool duplicates =
          result.where((element) => element.name == item.name).isNotEmpty;
      if (duplicates) {
        var index = result.indexWhere(
            (element) => element.name.toLowerCase() == item.name.toLowerCase());
        var product = [item, result[index]].reduce((value, element) {
          return new ShoppingListItem(
              element.shopping_list_from_recipes_id,
              element.name,
              element.amount + value.amount,
              element.unit,
              element.date + " | " + value.date);
        });
        result[index] = product;
      } else {
        result.add(item);
      }
    }

    return Future.value(result);
  }

  var recipes;
  @override
  Widget build(BuildContext context) {
    Map<String, bool> map = new Map();
    return SingleChildScrollView(
        child: Column(children: [
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
        Text("Zeige zusätzliche Informationen")
      ]),

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
                return Text(
                    "Es wurden keine Rezepte für diesen Zeitraum angelegt.");
              }
              // var validData = snapshot.requireData;
              // validData.reduce((value, element) {
              //   if (value.name == element.name) {
              //     value.amount = element.amount + value.amount;
              //     return value;
              //   }
              //   return element;
              // });
              // print(validData);
              for (var data in snapshot.requireData) {
                // children.add(

                //   CheckboxListTile(
                //   title: Wrap(alignment: WrapAlignment.spaceBetween,
                //       // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                //       children: [
                //         Column(
                //           children: [Text(data.name)],
                //         ),
                //         Column(
                //           children: [
                //             Text(data.amount.toString() + " " + data.unit)
                //           ],
                //         ),
                //       ]),
                //   value: isChecked.contains(data.name),
                //   shape: RoundedRectangleBorder(
                //       borderRadius: BorderRadius.circular(20)),
                //   subtitle: showAdditionalInfo ? Text(data.date) : null,
                //   checkColor: primaryColor,
                //   activeColor: Colors.transparent,
                //   onChanged: (bool? value) {
                //     if (value == true) {
                //       setState(() {
                //         isChecked.add(data.name);
                //       });
                //     } else {
                //       setState(() {
                //         isChecked.remove(data.name);
                //       });
                //     }
                //   },
                //   secondary: const Icon(Icons.hourglass_empty),
                // )
                // );

                children.add(CheckboxListTile(
                  title: Wrap(alignment: WrapAlignment.spaceBetween,
                      // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          children: [Text(data.name)],
                        ),
                        Column(
                          children: [
                            Text(data.amount.toString() + " " + data.unit)
                          ],
                        ),
                      ]),
                  value: isChecked.contains(data.name),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                  subtitle: showAdditionalInfo ? Text(data.date) : null,
                  checkColor: primaryColor,
                  activeColor: Colors.transparent,
                  onChanged: (bool? value) {
                    if (value == true) {
                      setState(() {
                        isChecked.add(data.name);
                      });
                    } else {
                      setState(() {
                        isChecked.remove(data.name);
                      });
                    }
                  },
                  secondary: const Icon(Icons.hourglass_empty),
                ));
              }
            }

            return Form(key: _formKey, child: Column(children: children));
          })
    ]));
  }
}
