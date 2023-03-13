import 'dart:io';

import 'package:cook_all_you_can/recipe/recipes.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../shared/shared.dart';

class RecipePopUp extends StatefulWidget {
  String name = "";
  RecipePopUp(String name, {super.key}) {
    this.name = name;
  }

  @override
  State<RecipePopUp> createState() => _RecipePopUpState(this.name);
}

class _RecipePopUpState extends State<RecipePopUp> {
  String recipe_name = "";
  List<String> list = <String>['1', '2', '3', '4'];
  String dropdownValue = '1';

  List<String> units = <String>['g', 'ml', 'Stück'];
  List<String> defaultUnit = ['g'];

  List<Recipe> recipes = [];
  List<Ingredient> ingredients = [Ingredient("", "", "")];
  List<String> manualSteps = [""];
  List<TextEditingController> ingredientController = [TextEditingController()];
  List<TextEditingController> manualStepsController = [TextEditingController()];
  List<TextEditingController> amountController = [TextEditingController()];
  List<TextEditingController> generalController =
      List.generate(2, (i) => TextEditingController());

  final supabase = Supabase.instance.client;

  _RecipePopUpState(String name) {
    this.recipe_name = name;
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    if (this.recipe_name != "") {
      supabase
          .from(RecipeTable().TABLENAME)
          .select('name, prep_time, id')
          .then((map) {});
    }
  }

  void addSteps() {
    setState(() {
      manualStepsController.add(TextEditingController());
      manualSteps.add("");
    });
  }

  void removeSteps(int index) {
    setState(() {
      manualStepsController.removeAt(index);
      manualSteps.removeAt(index);
    });
  }

  /// Variable Number of ingredients
  void addIngredients() {
    setState(() {
      ingredientController.add(TextEditingController());
      amountController.add(TextEditingController());
      defaultUnit.add("g");
      ingredients.add(Ingredient("Zutat", "", ""));
    });
  }

  /// remove ingredients
  void removeIngredients(int index) {
    setState(() {
      ingredientController.removeAt(index);
      amountController.removeAt(index);
      ingredients.removeAt(index);
    });
  }

  Future<void> submitRecipes() async {
    Ingredient currentIngredient;
    int recipe_id = 0;

    /// RecipeTable
    await supabase
        .from(RecipeTable().TABLENAME)
        .insert({
          "name": generalController[0]?.text ?? "----",
          "prep_time": generalController[1]?.text ?? 0,
          'number_of_people': dropdownValue
        })
        .select('id')
        .onError((error, stackTrace) => print("no data"))
        .then((value) async {
          recipe_id = value[0]['id'];

          Map<int, Map<String, dynamic>> updateIngredients = new Map();
          for (var i = 0; i < ingredients.length; i++) {
            var ingredient = ingredientController[i].text;
            updateIngredients[i] = {'name': ingredient, 'recipe_id': recipe_id};
          }

          /// RecipeItemTable
          await supabase
              .from(RecipeItemTable().TABLENAME)
              .insert(updateIngredients.values.toList())
              .select('id, name')
              .onError((error, stackTrace) => print("no data"))
              .then((map) async {
            ///
            Map<int, Map<String, dynamic>> updateIngredientAmount = new Map();
            for (var i = 0; i < map.length; i++) {
              var recipe_item_id = map[i]['id'];
              var amount = amountController[i].text;
              updateIngredientAmount[i] = {
                'recipe_item_id': recipe_item_id,
                'recipe_id': recipe_id,
                'amount': amount,
                'unit': defaultUnit[i]
              };
            }

            await supabase
                .from(AmountTable().TABLENAME)
                .insert(updateIngredientAmount.values.toList())
                .whenComplete(() async {
              await supabase
                  .from("recipe_manual")
                  .insert({'recipe_id': recipe_id, 'steps': manualSteps.length})
                  .select('id')
                  .then((value) async {
                    var recipe_manual_id = value[0]['id'];

                    Map<int, Map<String, dynamic>> updateSteps = new Map();
                    for (var i = 0; i < manualStepsController.length; i++) {
                      var step = manualStepsController[i].text;
                      print('step ${step}');
                      updateSteps[i] = {
                        'manual_id': recipe_manual_id,
                        'step': step
                      };
                    }
                    await supabase
                        .from("recipe_manual_steps")
                        .insert(updateSteps.values.toList())
                        .whenComplete(() {
                      Navigator.of(context).pop();
                      return new Future.value();
                    });
                  });
            });
          });
        });
  }

  /// Move to utils-class
  bool allFieldsAreFilled() {
    if (amountController.every((element) {
          return element.text != '';
        }) &&
        generalController.every((element) {
          return element.text != '';
        }) &&
        ingredientController.every((element) {
          return element.text != '';
        })) {
      return true;
    }

    return false;
  }

  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Rezept erstellen'),
          backgroundColor: Colors.green[300],
        ),
        body: Form(
            key: _formKey,
            child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: 1,
                itemBuilder: (BuildContext context, int index) {
                  return Container(
                    padding: EdgeInsets.all(0),
                    child: Wrap(
                      spacing: 5,
                      runSpacing: 8,
                      children: [
                        TextFormField(
                            controller: generalController[0],
                            decoration: const InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: 'Name',
                            ),
                            validator: (value) => validateTextForm(value)),
                        TextFormField(
                            controller: generalController[1],
                            decoration: const InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: 'Vorbereitungszeit [min]',
                            ),
                            validator: (value) => validateTextForm(value)),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Text("Anzahl von Personen"),
                              Expanded(
                                  child: Align(child: buildDropdown(context)))
                            ]),
                        for (var x = 0; x < ingredients.length; x++) ...[
                          Row(
                            children: <Widget>[
                              IconButton(
                                onPressed: () => removeIngredients(x),
                                icon:
                                    const Icon(Icons.playlist_remove_outlined),
                              ),
                              Flexible(
                                  child: TextFormField(
                                      controller: ingredientController[x],
                                      decoration: const InputDecoration(
                                          border: OutlineInputBorder(),
                                          labelText: 'Zutat',
                                          isDense: true),
                                      validator: (value) =>
                                          validateTextForm(value))),
                            ],
                          ),
                          Row(children: <Widget>[
                            Spacer(),
                            Flexible(
                                flex: 2,
                                child: TextFormField(
                                    controller: amountController[x],
                                    decoration: const InputDecoration(
                                        border: OutlineInputBorder(),
                                        labelText: 'Menge',
                                        isDense: true),
                                    validator: (value) =>
                                        validateTextForm(value))),
                            Spacer(),
                            Flexible(
                                flex: 1,
                                child: DropdownButton<String>(
                                  value: defaultUnit[x],
                                  onChanged: (String? value) {
                                    setState(() {
                                      defaultUnit[x] = value!.toString();
                                    });
                                  },
                                  items: units.map((String value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(value),
                                    );
                                  }).toList(),
                                ))
                          ])
                        ],
                        Row(children: <Widget>[
                          Expanded(
                              flex: 0,
                              child: Align(
                                alignment: Alignment.bottomLeft,
                                child: IconButton(
                                  onPressed: () => addIngredients(),
                                  icon: const Icon(Icons.playlist_add_outlined),
                                ),
                              )),
                          Text("Zutat")
                        ]),
                        for (var x = 0;
                            x < manualStepsController.length;
                            x++) ...[
                          Row(
                            children: <Widget>[
                              IconButton(
                                onPressed: () => removeSteps(x),
                                icon:
                                    const Icon(Icons.playlist_remove_outlined),
                              ),
                              Flexible(
                                  child: TextFormField(
                                      controller: manualStepsController[x],
                                      decoration: const InputDecoration(
                                          border: OutlineInputBorder(),
                                          labelText: 'Schritt',
                                          isDense: true),
                                      validator: (value) =>
                                          validateTextForm(value))),
                            ],
                          )
                        ],
                        Row(children: <Widget>[
                          Expanded(
                              flex: 0,
                              child: Align(
                                alignment: Alignment.bottomLeft,
                                child: IconButton(
                                  onPressed: () => addSteps(),
                                  icon: const Icon(Icons.playlist_add_outlined),
                                ),
                              )),
                          Text("Schritt"),
                          Expanded(
                              child: Align(
                            alignment: Alignment.bottomRight,
                            child: IconButton(
                              onPressed: () {
                                if (_formKey.currentState!.validate()) {
                                  // If the form is valid, display a snackbar. In the real world,
                                  // you'd often call a server or save the information in a database.
                                  var snackbar = showNotification(
                                      context, "Rezept wird angelegt");
                                  submitRecipes().then((value) => {
                                        sleep(Duration(seconds: 1)),
                                        snackbar.close()
                                      });
                                }
                              },
                              icon: const Icon(Icons.send),
                            ),
                          )),
                        ]),
                      ],
                    ),
                  );
                })
            // child: Column(
            //   children: <Widget>[
            // TextFormField(
            //   // The validator receives the text that the user has entered.
            //   validator: (value) {
            //     if (value == null || value.isEmpty) {
            //       return 'Please enter some text';
            //     }
            //     return null;
            //   },
            // ),
            // ElevatedButton(
            //   onPressed: () {
            //     // Validate returns true if the form is valid, or false otherwise.
            //     if (_formKey.currentState!.validate()) {
            //       // If the form is valid, display a snackbar. In the real world,
            //       // you'd often call a server or save the information in a database.
            //       ScaffoldMessenger.of(context).showSnackBar(
            //         const SnackBar(content: Text('Processing Data')),
            //       );
            //     }
            //   },
            //   child: const Text('Submit'),
            // ),
            // Add TextFormFields and ElevatedButton here.
            // ],
            // ),
            ));
  }
  // @override
  // Widget build(BuildContext context) {
  //   return Scaffold(
  //       appBar: AppBar(
  //         title: Text('Rezepte'),
  //         backgroundColor: Colors.green[300],
  //       ),
  //       body: ListView.builder(
  //         padding: const EdgeInsets.all(20),
  //         itemCount: 1,
  //         itemBuilder: (BuildContext context, int index) {
  //           return Container(
  //             padding: EdgeInsets.all(0),
  //             child: Wrap(
  //               spacing: 5,
  //               runSpacing: 8,
  //               children: [
  //                 TextField(
  //                     controller: generalController[0],
  //                     decoration: const InputDecoration(
  //                       border: OutlineInputBorder(),
  //                       labelText: 'Name',
  //                     )),
  //                 TextField(
  //                     controller: generalController[1],
  //                     decoration: const InputDecoration(
  //                       border: OutlineInputBorder(),
  //                       labelText: 'Vorbereitungszeit [min]',
  //                     )),
  //                 Row(mainAxisAlignment: MainAxisAlignment.start, children: [
  //                   Text("Anzahl von Personen"),
  //                   Expanded(child: Align(child: buildDropdown(context)))
  //                 ]),
  //                 for (var x = 0; x < ingredients.length; x++) ...[
  //                   Row(
  //                     children: <Widget>[
  //                       IconButton(
  //                         onPressed: () => removeIngredients(x),
  //                         icon: const Icon(Icons.remove),
  //                       ),
  //                       Flexible(
  //                           child: TextField(
  //                               controller: ingredientController[x],
  //                               decoration: const InputDecoration(
  //                                   border: OutlineInputBorder(),
  //                                   labelText: 'Zutat',
  //                                   isDense: true))),
  //                     ],
  //                   ),
  //                   Row(children: <Widget>[
  //                     Spacer(),
  //                     Flexible(
  //                         flex: 2,
  //                         child: TextField(
  //                             controller: amountController[x],
  //                             decoration: const InputDecoration(
  //                                 border: OutlineInputBorder(),
  //                                 labelText: 'Menge',
  //                                 isDense: true))),
  //                     Spacer(),
  //                     Flexible(
  //                         flex: 1,
  //                         child: DropdownButton<String>(
  //                           value: defaultUnit[x],
  //                           onChanged: (String? value) {
  //                             setState(() {
  //                               defaultUnit[x] = value!.toString();
  //                             });
  //                           },
  //                           items: units.map((String value) {
  //                             return DropdownMenuItem<String>(
  //                               value: value,
  //                               child: Text(value),
  //                             );
  //                           }).toList(),
  //                         ))
  //                   ])
  //                 ],
  //                 Row(children: <Widget>[
  //                   Expanded(
  //                       flex: 0,
  //                       child: Align(
  //                         alignment: Alignment.bottomLeft,
  //                         child: IconButton(
  //                           onPressed: () => addIngredients(),
  //                           icon: const Icon(Icons.add),
  //                         ),
  //                       )),
  //                   Text("Zutat")
  //                 ]),
  //                 for (var x = 0; x < manualStepsController.length; x++) ...[
  //                   Row(
  //                     children: <Widget>[
  //                       IconButton(
  //                         onPressed: () => removeSteps(x),
  //                         icon: const Icon(Icons.remove),
  //                       ),
  //                       Flexible(
  //                           child: TextField(
  //                               controller: manualStepsController[x],
  //                               decoration: const InputDecoration(
  //                                   border: OutlineInputBorder(),
  //                                   labelText: 'Schritt',
  //                                   isDense: true))),
  //                     ],
  //                   )
  //                 ],
  //                 Row(children: <Widget>[
  //                   Expanded(
  //                       flex: 0,
  //                       child: Align(
  //                         alignment: Alignment.bottomLeft,
  //                         child: IconButton(
  //                           onPressed: () => addSteps(),
  //                           icon: const Icon(Icons.add),
  //                         ),
  //                       )),
  //                   Text("Schritt"),
  //                   Expanded(
  //                       child: Align(
  //                     alignment: Alignment.bottomRight,
  //                     child: IconButton(
  //                       onPressed: () {
  //                         submitRecipes();
  //                       },
  //                       icon: const Icon(Icons.send),
  //                     ),
  //                   )),
  //                 ]),
  //               ],
  //             ),
  //           );
  //         },
  //       ));
  // }

  @override
  Widget buildDropdown(BuildContext context) {
    return Flexible(
        flex: 1,
        child: DropdownButton<String>(
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
            });
          },
          items: list.map((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ));
  }
}
