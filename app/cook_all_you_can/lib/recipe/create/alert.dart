import 'package:cook_all_you_can/recipe/create/test.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:cook_all_you_can/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

import '../../shared/database/interactions.dart';

class RecipePopUp extends StatefulWidget {
  const RecipePopUp({super.key});

  @override
  State<RecipePopUp> createState() => _RecipePopUpState();
}

class _RecipePopUpState extends State<RecipePopUp> {
  List<Recipe> recipes = [];
  List<Ingredient> ingredients = [Ingredient("Zutat 1", "", "")];
  List<TextEditingController> ingredientController =
      List.generate(10, (i) => TextEditingController());
  List<TextEditingController> amountController =
      List.generate(10, (i) => TextEditingController());
  List<TextEditingController> generalController =
      List.generate(4, (i) => TextEditingController());

  String selectedValue = "Gramm";

  void updateIngredients() {
    setState(() {
      ingredients.add(Ingredient("Zutat", "", ""));
    });
  }

  void submitRecipes() async {
    Ingredient currentIngredient;
    await Database.insertIntoTable(RecipeTable({
      "name": generalController[0].text,
      "prep_time": generalController[1].text
    })).whenComplete(() async {
      await Database.selectFrom(RecipeTable({"id": ""})).then((map) async {
        var id = map.entries.first.value.values.first;

        for (var i = 0; i < ingredients.length; i++) {
          // await Database.selectFrom(
          //         RecipeItemTable({"name": ingredientController[i].text}))
          //     .then((map) {
          //   var id = map.entries.first.value.values.first;

          //   print(map);
          // });
          Database.insertIntoTable(RecipeItemTable({
            "name": ingredientController[i].text,
            "amount": amountController[i].text,
          }));
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
        title: const Text('Neues Rezept'),
        content: Scaffold(
            body: ListView.builder(
          padding: const EdgeInsets.all(0),
          itemCount: 1,
          itemBuilder: (BuildContext context, int index) {
            return Container(
              padding: EdgeInsets.all(0),
              child: Wrap(spacing: 5, runSpacing: 8, children: [
                TextField(
                    controller: generalController[0],
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Name',
                    )),
                TextField(
                    controller: generalController[1],
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Vorbereitungszeit [min]',
                    )),
                for (var x = 0; x < ingredients.length; x++) ...[
                  Row(
                    children: <Widget>[
                      Flexible(
                          child: TextField(
                              controller: ingredientController[x],
                              decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  labelText: 'Zutat',
                                  isDense: true))),
                      Flexible(
                          child: TextField(
                              controller: amountController[x],
                              decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  labelText: 'Menge mit \nEinheit [1000 g]',
                                  isDense: true))),
                    ],
                  )
                ],
                Row(children: <Widget>[
                  IconButton(
                    onPressed: () => updateIngredients(),
                    icon: const Icon(Icons.add),
                  ),
                  IconButton(
                    onPressed: () => submitRecipes(),
                    icon: const Icon(Icons.send),
                  )
                ])
              ]
                  // Row(
                  //   mainAxisSize: MainAxisSize.min,
                  //   children: [
                  // Icon(Icons.star, color: Colors.green[500]),
                  // Icon(Icons.star, color: Colors.green[500]),
                  // Icon(Icons.star, color: Colors.green[500]),
                  // const Icon(Icons.star, color: Colors.black),
                  // const Icon(Icons.star, color: Colors.black),
                  // ],
                  // ),
                  //   DropdownButton(
                  //     value: selectedValue,
                  //     items: dropdownItems,
                  //     onChanged: (String? newValue) {
                  //       setState(() {
                  //         selectedValue = newValue!;
                  //       });
                  //     },
                  //   )
                  // ],
                  // IconButton(
                  //   onPressed: () => updateIngredients(),
                  //   icon: const Icon(Icons.add),
                  // )
                  // ],
                  ),
            );
          },
          // separatorBuilder: (BuildContext context, int index) {
          //   return SizedBox(height: 10);
          // }
        ))
        // actions: <Widget>[
        //   FloatingActionButton(
        //     onPressed: () {
        //       Navigator.of(context).pop();
        //     },
        //     child: const Text('Close'),
        //   ),
        // ]
        );
  }
}
