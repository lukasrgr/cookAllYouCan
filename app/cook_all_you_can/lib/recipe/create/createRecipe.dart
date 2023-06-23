import 'dart:developer';
import 'dart:io';

import 'package:cook_all_you_can/recipe/recipes.dart';
import 'package:cook_all_you_can/recipe/showRecipe.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../shared/shared.dart';

class RecipePopUp extends StatefulWidget {
  late final WholeRecipeContent? wholeRecipe;
  RecipePopUp([WholeRecipeContent? wholeRecipe]) {
    this.wholeRecipe = wholeRecipe!;
  }

  @override
  State<RecipePopUp> createState() => _RecipePopUpState(wholeRecipe!);
}

class _RecipePopUpState extends State<RecipePopUp> {
  final supabase = Supabase.instance.client;
  String recipe_name = "";
  List<String> numberOfPeopleList = <String>['1', '2', '3', '4'];
  String numberOfPeopleDropdownValue = '1';

  ///
  List<Recipe> recipes = [];
  List<Ingredient> ingredients = [Ingredient("", "", "")];
  List<TextEditingController> ingredientController = [TextEditingController()];
  List<String> manualSteps = [""];
  List<TextEditingController> manualStepsController = [TextEditingController()];
  List<TextEditingController> amountController = [TextEditingController()];
  List<TextEditingController> generalController =
      List.generate(2, (i) => TextEditingController());

  late WholeRecipeContent wholeRecipe;

  String isInsertOrUpdate = 'insert';

  Map<String, List<Map<int, dynamic>>> changedValues = new Map();

  var changedWholeRecipe;

  // TODO Datamodel
  // List<String> importanceList = <String>['Essentiell', 'Optional'];
  // List<String> importanceDropdownValue = ['Essentiell'];

  _RecipePopUpState([WholeRecipeContent? wholeRecipe]) {
    this.wholeRecipe = wholeRecipe!;
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    /// TODO: find better way to distinguish showRecipe or recipes as pevious view
    if (wholeRecipe?.recipe?.id != 0) {
      isInsertOrUpdate = 'update';
      // Empty Lists for recipe editing
      defaultUnit.clear();
      // importanceDropdownValue.clear();
      ingredients.clear();
      manualStepsController.clear();

      generalController[0].text = wholeRecipe.recipe.name;
      generalController[1].text = wholeRecipe.recipe.prep_time.toString();
      // generalController[0].addListener(
      //     _listener(generalController[0], 0, RecipeTable().TABLENAME));
      // generalController[1].addListener(
      //     _listener(generalController[1], 1, RecipeTable().TABLENAME));

      numberOfPeopleDropdownValue =
          wholeRecipe.recipe.number_of_people.toString();

      for (var recipe_item_id in wholeRecipe.recipeItem.asMap().keys) {
        addIngredient(
            wholeRecipe,
            wholeRecipe.recipeItem
                .firstWhere((element) => element.id == recipe_item_id)
                .id);
      }

      for (var manual_step_id in wholeRecipe.recipeManualSteps.asMap().keys) {
        manualStepsController.add(TextEditingController());
        manualStepsController[manual_step_id].text =
            wholeRecipe.recipeManualSteps[manual_step_id].step;
        // manualStepsController[x].addListener(
        //     _listener(manualStepsController[x], x, "recipe_manual_steps"));
      }
    }
  }

  void addSteps() {
    setState(() {
      manualStepsController.add(TextEditingController());
    });
  }

  void removeSteps(int index) {
    setState(() {
      manualStepsController.removeAt(index);
    });
  }

  /// Variable Number of ingredients
  void addIngredients() {
    setState(() {
      ingredientController.add(TextEditingController());
      amountController.add(TextEditingController());
      defaultUnit.add("g");
      ingredients.add(Ingredient("Zutat", "", ""));
      // importanceDropdownValue.add("Essentiell");
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
    if (isInsertOrUpdate == 'update') {
      return updateExistingRecipe();
    } else if (isInsertOrUpdate == 'insert') {
      return insertNewRecipe();
    }
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
                padding: const EdgeInsets.all(10),
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
                            onChanged: _listener(generalController[0], 0,
                                RecipeTable().TABLENAME),
                            decoration: const InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: 'Name',
                            ),
                            validator: (value) => validateTextForm(value)),
                        TextFormField(
                            controller: generalController[1],
                            onChanged: _listener(generalController[1], 1,
                                RecipeTable().TABLENAME),
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
                                  child: Align(
                                      child: buildDropdown(
                                          context,
                                          numberOfPeopleDropdownValue,
                                          numberOfPeopleList)))
                            ]),
                        for (var x = 0; x < ingredients.length; x++) ...[
                          /// TODO: Think of datamodel with optional Ingredients and nutritiontable
                          // Row(
                          //     mainAxisAlignment: MainAxisAlignment.start,
                          //     children: [
                          //       Text("Wichtigkeit"),
                          //       Expanded(
                          //           child: Align(
                          //               child: buildDropdown(
                          //                   context,
                          //                   importanceDropdownValue[x],
                          //                   importanceList)))
                          //     ]),
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
                                      onChanged: _listener(
                                          ingredientController[x],
                                          x,
                                          RecipeItemTable().TABLENAME),
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
                                    onChanged: _listener(amountController[x], x,
                                        AmountTable().TABLENAME),
                                    decoration: const InputDecoration(
                                        border: OutlineInputBorder(),
                                        labelText: 'Menge',
                                        isDense: true),
                                    validator: (value) {
                                      validateTextForm(value);
                                    })),
                            Spacer(),
                            Flexible(
                                flex: 2,
                                child: DropdownButton<String>(
                                  value: defaultUnit[x],
                                  onChanged: (String? value) {
                                    setState(() {
                                      defaultUnit[x] = value!.toString();
                                    });
                                  },
                                  items: unitsForIngredient.map((String value) {
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
                                maxLines: null,
                                validator: (value) => validateTextForm(value),
                                onChanged: (value) {
                                  _listener(manualStepsController[x], x,
                                      "recipe_manual_steps");
                                  // if (changedValues['recipe_manual_steps']
                                  //         ?.isEmpty ??
                                  //     true) {
                                  //   changedValues['recipe_manual_steps'] = [];
                                  // }
                                  // manualStepsController[x].
                                  // changedValues['recipe_manual_steps']
                                  //     ?.add({x: value});
                                },
                              )),
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
                })));
  }

  @override
  Widget buildDropdown(
      BuildContext context, String dropdownValue, List<String> list) {
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
              print(value);
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

  void addIngredient(WholeRecipeContent wholeRecipe, int index) {
    ingredientController.add(TextEditingController());
    amountController.add(TextEditingController());
    defaultUnit.add(wholeRecipe.amount[index].unit.toString());

    ingredientController[index].text = wholeRecipe.recipeItem[index].name;
    amountController[index].text = (wholeRecipe.amount[index].amount is int
            ? (wholeRecipe.amount[index].amount as int).toDouble()
            : wholeRecipe.amount[index].amount)
        .toString();

    // importanceDropdownValue.add("Essentiell");
    ingredients.add(Ingredient("Zutat", "", ""));
    // ingredientController[index].addListener(_listener(
    //     ingredientController[index], index, RecipeItemTable().TABLENAME));
    // amountController[index].addListener(
    //     _listener(amountController[index], index, AmountTable().TABLENAME));
  }

  _listener(TextEditingController controller, int index, String tableName) {
    changedValues[tableName] != null
        ? changedValues[tableName]?.add({index: controller.text})
        : changedValues[tableName] = [];
  }

  void generateChangedWholeRecipe() {
    List<RecipeItem> recipeItems = [];
    List<RecipeAmount> recipeAmount = [];
    RecipeManual manual =
        new RecipeManual(manualStepsController.length, wholeRecipe.recipe.id);
    List<RecipeManualStep> manualSteps = [];

    for (var recipe_item_id in ingredientController.asMap().keys) {
      recipeItems.add(new RecipeItem(ingredientController[recipe_item_id].text,
          wholeRecipe.recipe.id, recipe_item_id));
      recipeAmount.add(new RecipeAmount(
          recipe_item_id,
          wholeRecipe.recipe.id,
          amountController[recipe_item_id].text as double,
          defaultUnit[recipe_item_id]));
    }

    for (var manual_id in manualStepsController.asMap().keys) {
      manualSteps.add(new RecipeManualStep(
          manual_id, manual_id, manualStepsController[manual_id].text));
    }

    // this.changedWholeRecipe = new WholeRecipeContent(
    //   new Recipe(generalController[0].text,generalController[1].text,null,numberOfPeopleDropdownValue as int, wholeRecipe.recipe.id),
  }

  Future<void> updateExistingRecipe() async {
    int recipe_id = 0;
    debugger();

    Map<String, List<Map<int, dynamic>>> changedValues2 = new Map();

    /**
     * Option 1: 
     * - Delete ingredients and manualsteps
     * - update recipe and manual
     * 
     * Option 2:
     * update all
     */

    if (wholeRecipe.recipe.name != generalController[0].text) {
      changedValues2[RecipeTable().TABLENAME] = [
        {wholeRecipe.recipe.id: generalController[0].text}
      ];
    }

    if (wholeRecipe.recipe.rating != generalController[0].text) {
      changedValues2[RecipeTable().TABLENAME] = [
        {wholeRecipe.recipe.id: generalController[0].text}
      ];
    }

    await supabase
        .from(RecipeTable().TABLENAME)
        .update({
          "name": generalController[0]?.text ?? "----",
          // "prep_time": generalController[1]? ?? 0,
          'number_of_people': numberOfPeopleDropdownValue
        })
        .select('id')
        .onError((error, stackTrace) => print("no data"))
        .then((value) async {
          debugger();
          recipe_id = value[0]['id'];

          Map<int, Map<String, dynamic>> updateIngredients = new Map();
          for (var i = 0; i < ingredients.length; i++) {
            var ingredient = ingredientController[i].text;
            updateIngredients[i] = {
              'name': ingredient,
              'recipe_id': recipe_id,
              // 'importance': importanceDropdownValue[i]
            };
          }

          /// RecipeItemTable
          await supabase
              .from(RecipeItemTable().TABLENAME)
              .update(updateIngredients)
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
                'amount': amount.replaceAll(',', '.'),
                'unit': defaultUnit[i]
              };
            }

            await supabase
                .from(AmountTable().TABLENAME)
                .update(updateIngredientAmount)
                .whenComplete(() async {
              await supabase
                  .from("recipe_manual")
                  .update({
                    'recipe_id': recipe_id,
                    'steps': manualStepsController.length
                  })
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
                        .update(updateSteps)
                        .select('id')
                        .whenComplete(() {
                      Navigator.of(context).pop();
                      return new Future.value();
                    });
                  });
            });
          });
        });
  }

  Future<void> insertNewRecipe() async {
    int recipe_id = 0;
    await supabase
        .from(RecipeTable().TABLENAME)
        .insert({
          "name": generalController[0]?.text ?? "----",
          "prep_time": generalController[1]?.text ?? 0,
          'number_of_people': numberOfPeopleDropdownValue
        })
        .select('id')
        .onError((error, stackTrace) => print("no data"))
        .then((value) async {
          recipe_id = value[0]['id'];

          Map<int, Map<String, dynamic>> updateIngredients = new Map();
          for (var i = 0; i < ingredients.length; i++) {
            var ingredient = ingredientController[i].text;
            updateIngredients[i] = {
              'name': ingredient,
              'recipe_id': recipe_id,
              // 'importance': importanceDropdownValue[i]
            };
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
                'amount': amount.replaceAll(',', '.'),
                'unit': defaultUnit[i]
              };
            }

            await supabase
                .from(AmountTable().TABLENAME)
                .insert(updateIngredientAmount.values.toList())
                .whenComplete(() async {
              await supabase
                  .from("recipe_manual")
                  .insert({
                    'recipe_id': recipe_id,
                    'steps': manualStepsController.length
                  })
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
                        .select('id')
                        .whenComplete(() {
                      Navigator.of(context).pop();
                      return new Future.value();
                    });
                  });
            });
          });
        });
  }
}
