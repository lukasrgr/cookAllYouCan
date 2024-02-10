import 'dart:developer';
import 'dart:io';

import 'package:cook_all_you_can/index/pages/overview/recipe/show/show.dart';
import 'package:cook_all_you_can/index/pages/shared/database/table.dart';
import 'package:cook_all_you_can/index/pages/shared/loadingOverlay/loadingOverlay.dart';
import 'package:cook_all_you_can/index/pages/shared/utils.dart';
import 'package:flutter/material.dart';
import 'package:multi_dropdown/multiselect_dropdown.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../shared/service/service.dart';
import '../../../shared/settings/theme/theme.dart';
import '../../../shared/shared.dart';

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

  List<String> numberOfPeopleList = <String>['1', '2', '3', '4', '5', '6'];
  String numberOfPeopleDropdownValue = '1';

  List<Recipe> recipes = [];
  List<Ingredient> ingredients = [Ingredient("", "", "")];
  List<String> manualSteps = [""];

  List<TextEditingController> amountController = [TextEditingController()],
      manualStepsController = [TextEditingController()],
      ingredientController = [TextEditingController()];
  List<TextEditingController> generalController =
      List.generate(3, (i) => TextEditingController());

  bool _isLoading = false;

  late WholeRecipeContent wholeRecipe;
  String isInsertOrUpdateRecipe = 'insert';

  MultiSelectController categoryController = new MultiSelectController();

  // TODO Datamodel
  // List<String> importanceList = <String>['Essentiell', 'Optional'];
  // List<String> importanceDropdownValue = ['Essentiell'];

  _RecipePopUpState([WholeRecipeContent? wholeRecipe]) {
    this.wholeRecipe = wholeRecipe!;
  }

  void initState() {
    super.initState();
    // super.initState();

    // TODO: find better way to distinguish showRecipe or recipes as previous view
    if (wholeRecipe?.recipe?.id != 0) {
      isInsertOrUpdateRecipe = 'update';
      // Empty Lists for recipe editing
      defaultUnit.clear();
      // importanceDropdownValue.clear();
      ingredients.clear();
      manualSteps.clear();
      manualStepsController.clear();

      generalController[0].text = wholeRecipe.recipe.name;
      generalController[1].text = wholeRecipe.recipe.prep_time.toString();
      // wholeRecipe.recipe.category?.forEach((element) {
      //   debugger();
      //   categoryController.addSelectedOption(
      //       ValueItem(label: element.name, value: element.id.toString()));
      // });

      numberOfPeopleDropdownValue =
          wholeRecipe.recipe.number_of_people.toString();

      for (var recipe_item in wholeRecipe.recipeItem) {
        var recipeItemId = wholeRecipe.recipeItem
            .indexWhere((element) => element.id == recipe_item.id);

        // ignore: unnecessary_null_comparison
        if (recipe_item.id == null) {
          continue;
        }
        addIngredient(wholeRecipe, recipeItemId);
      }

      for (var manual_step_id in wholeRecipe.recipeManualSteps.asMap().keys) {
        manualStepsController.add(TextEditingController());
        manualStepsController[manual_step_id].text =
            wholeRecipe.recipeManualSteps[manual_step_id].step;
        manualSteps.add(wholeRecipe.recipeManualSteps[manual_step_id].step);
      }
    }
  }

  Future<void> submitRecipes() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        this._isLoading = true;
      });

      if (isInsertOrUpdateRecipe == 'update') {
        updateExistingRecipe().whenComplete(() {
          setState(() {
            this._isLoading = false;
          });
          Navigator.of(context).pop();
        });
      } else if (isInsertOrUpdateRecipe == 'insert') {
        insertNewRecipe().whenComplete(() {
          setState(() {
            this._isLoading = false;
          });
          Navigator.of(context).pop();
        });
      }
    }

    var snackbar = showNotification(
      context,
      isInsertOrUpdateRecipe == 'update'
          ? 'Rezept wird aktualisiert, Kalendar und Einkausfsliste wird nicht upgedated'
          : 'Rezept wird angelegt',
    );
    // sleep(Duration(seconds: 3));
    snackbar.close();
  }

  final _formKey = GlobalKey<FormState>();

// Stack(
//       children: [
//         widget.child,
//         if (_isLoading)
//           const Opacity(
//             opacity: 0.8,
//             child: ModalBarrier(dismissible: false, color: Colors.black),
//           ),
//         if (_isLoading)
//           Center(
//               child: Column(
//             children: [
//               MyThemes.ThemedCircularProgressIndicator,
//             ],
//           )),
//       ],
//     );
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
            appBar: getAppBar(
                context,
                isInsertOrUpdateRecipe == 'insert'
                    ? 'Rezept erstellen'
                    : 'Rezept updaten'),
            body: Form(
                key: _formKey,
                child: ListView.builder(
                    padding: const EdgeInsets.all(10),
                    itemCount: 1,
                    itemBuilder: (BuildContext context, int index) {
                      var stateController = new MaterialStatesController();
                      return Container(
                          padding: EdgeInsets.all(0),
                          child: Wrap(spacing: 5, runSpacing: 8, children: [
                            TextFormField(
                                controller: generalController[0],
                                onChanged: _listener(generalController[0], 0,
                                    RecipeTable().TABLENAME),
                                decoration:
                                    MyThemes.ThemedInputDecoration("Name", ""),
                                validator: (value) => validateTextForm(value)),
                            TextFormField(
                                controller: generalController[1],
                                onChanged: _listener(generalController[1], 1,
                                    RecipeTable().TABLENAME),
                                decoration: MyThemes.ThemedInputDecoration(
                                    "Vorbereitungszeit [min]", ""),
                                validator: (value) => validateTextForm(value)),
                            MultiSelectDropDown(
                              selectionType: SelectionType.multi,
                              fieldBackgroundColor:
                                  MyThemes.canvasBackgroundColor,
                              // backgroundColor: MyThemes.canvasBackgroundColor,
                              dropdownBackgroundColor:
                                  MyThemes.canvasBackgroundColor,
                              showClearIcon: true,
                              controller: categoryController,
                              chipConfig: ChipConfig(
                                wrapType: WrapType.wrap,
                                backgroundColor: MyThemes.secondaryColor,
                                labelStyle:
                                    TextStyle(color: MyThemes.primaryColor),
                                spacing: 4,
                              ),
                              onOptionSelected:
                                  (List<ValueItem> selectedOptions) {},
                              options: Service.category
                                  .map((e) => ValueItem(
                                      label: e.name, value: e.id.toString()))
                                  .toList(),
                              dropdownHeight: 300,
                              optionTextStyle: const TextStyle(
                                  fontSize: 16, color: Colors.white),
                              selectedOptionIcon: const Icon(
                                Icons.check_box,
                                color: Colors.white,
                              ),
                              optionsBackgroundColor:
                                  MyThemes.canvasBackgroundColor,
                              selectedOptionBackgroundColor:
                                  MyThemes.canvasBackgroundColor,
                              selectedOptions: wholeRecipe.recipe.category
                                      ?.map((e) => ValueItem(
                                          label: e.name,
                                          value: e.id.toString()))
                                      .toList() ??
                                  [],
                            ),
                            Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Text(
                                    "Anzahl von Personen",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  Expanded(
                                      child: Align(
                                          child: Material(
                                              type: MaterialType.transparency,
                                              child: DropdownButton<String>(
                                                value:
                                                    numberOfPeopleDropdownValue,
                                                elevation: 16,
                                                style: const TextStyle(
                                                    fontSize: 16),
                                                underline: Container(
                                                  height: 2,
                                                  width: 10,
                                                ),
                                                onChanged: (String? value) {
                                                  // This is called when the user selects an item.
                                                  setState(() {
                                                    print(value);
                                                    numberOfPeopleDropdownValue =
                                                        value!.toString();
                                                  });
                                                },
                                                items: numberOfPeopleList
                                                    .map((String value) {
                                                  return DropdownMenuItem<
                                                      String>(
                                                    value: value,
                                                    child: Text(value),
                                                  );
                                                }).toList(),
                                              ))))
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
                                    icon: const Icon(Icons.remove_outlined),
                                  ),
                                  Flexible(
                                      child: TextFormField(
                                          controller: ingredientController[x],
                                          onChanged: _listener(
                                              ingredientController[x],
                                              x,
                                              RecipeItemTable().TABLENAME),
                                          decoration:
                                              MyThemes.ThemedInputDecoration(
                                                  "Zutat (Singular)", ""),
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
                                        onChanged: _listener(
                                            amountController[x],
                                            x,
                                            AmountTable().TABLENAME),
                                        decoration:
                                            MyThemes.ThemedInputDecoration(
                                                "Menge", ""),
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
                                      items: unitsForIngredient
                                          .map((String value) {
                                        return DropdownMenuItem<String>(
                                          value: value,
                                          child: Text(
                                            value,
                                            style:
                                                TextStyle(color: Colors.white),
                                          ),
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
                                      icon: const Icon(Icons.add_outlined),
                                      style: ButtonStyle(
                                          iconColor:
                                              MaterialStateProperty.resolveWith(
                                                  (states) =>
                                                      MyThemes.primaryColor)),
                                    ),
                                  )),
                              Text(
                                "Zutat",
                                style: TextStyle(color: Colors.white),
                              )
                            ]),
                            for (var x = 0;
                                x < manualStepsController.length;
                                x++) ...[
                              Row(
                                children: <Widget>[
                                  IconButton(
                                    onPressed: () => removeSteps(x),
                                    icon: const Icon(
                                        Icons.playlist_remove_outlined),
                                  ),
                                  Flexible(
                                      child: TextFormField(
                                    controller: manualStepsController[x],
                                    decoration: MyThemes.ThemedInputDecoration(
                                        "Schritt " + (x + 1).toString(), ""),
                                    maxLines: null,
                                    validator: (value) =>
                                        validateTextForm(value),
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
                                      icon: const Icon(
                                          Icons.playlist_add_outlined),
                                    ),
                                  )),
                              Text("Schritt",
                                  style: TextStyle(color: MyThemes.textColor)),
                            ]),
                            ElevatedButton(
                              statesController: stateController,
                              onPressed: this._isLoading
                                  ? null
                                  : () {
                                      submitRecipes();
                                    },
                              child: Text("abschicken",
                                  style: TextStyle(
                                      color: MyThemes.secondaryColor)),
                            ),
                          ]));
                    }))
            // )
            ),

        // TODO: use statefullwidget Loadingoverlay
        if (_isLoading)
          const Opacity(
            opacity: 0.8,
            child: ModalBarrier(dismissible: false, color: Colors.black),
          ),
        if (_isLoading)
          Center(
              child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              MyThemes.ThemedCircularProgressIndicator,
            ],
          )),
      ],
    );
  }

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
    if (wholeRecipe.amount.isEmpty || wholeRecipe.recipeItem.isEmpty) {
      return;
    }

    ingredientController.add(TextEditingController());
    amountController.add(TextEditingController());
    defaultUnit.add(wholeRecipe.amount[index]!.unit.toString());

    ingredientController[index]!.text = wholeRecipe.recipeItem[index]!.name;
    amountController[index]!.text = (wholeRecipe.amount[index]!.amount is int
            ? (wholeRecipe.amount[index]!.amount as int).toDouble()
            : wholeRecipe.amount[index]!.amount)
        .toString();

    ingredients.add(Ingredient("Zutat", "", ""));
  }

  _listener(TextEditingController controller, int index, String tableName) {
    // changedValues[tableName] != null
    //     ? changedValues[tableName]?.add({index: controller.text})
    //     : changedValues[tableName] = [];
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
  }

  Future<void> updateExistingRecipe() async {
    int recipe_id = 0;

    Map<String, List<Map<int, dynamic>>> changedValues2 = new Map();

// Name
    if (wholeRecipe.recipe.name != generalController[0].text) {
      changedValues2[RecipeTable().TABLENAME] = [
        {wholeRecipe.recipe.id: generalController[0].text}
      ];
    }

// Prep time
    if (wholeRecipe.recipe.rating != generalController[0].text) {
      changedValues2[RecipeTable().TABLENAME] = [
        {wholeRecipe.recipe.id: generalController[0].text}
      ];
    }

    await supabase
        .from(RecipeTable().TABLENAME)
        .select('created_from_household')
        .eq('id', wholeRecipe.recipe.id)
        .then((value) {
      if (value[0]['created_from_household'] != Service.user.household) {
        var snackbar = showNotification(context,
            "Benutzer hat das Rezept nicht erstellt und kann es damit nicht bearbeiten");
        sleep(Duration(seconds: 3));
        snackbar.close();
        // Navigator.of(context).pop();
      }
    }).whenComplete(() async {
      await supabase
          .from(RecipeTable().TABLENAME)
          .update({
            'name': generalController[0].text,
            'prep_time': generalController[1].text,
            'number_of_people': numberOfPeopleDropdownValue,
            'created_from_household': Service.user.household
          })
          .eq('id', wholeRecipe.recipe.id)
          .select('id')
          .onError((error, stackTrace) => print("no data"))
          .then((value) async {
            recipe_id = value[0]['id'];

            await insertCategories(recipe_id);

            for (var i = 0; i < ingredients.length; i++) {
              var ingredient = ingredientController[i].text;

              if (wholeRecipe!.recipeItem.length > i &&
                  wholeRecipe!.recipeItem.elementAt(i)?.id != null) {
                await supabase
                    .from(RecipeItemTable().TABLENAME)
                    .update({'name': ingredient})
                    .match({'id': wholeRecipe.recipeItem[i].id})
                    .select('id, name')
                    .then((map) async {
                      await supabase.from(AmountTable().TABLENAME).update({
                        'amount': amountController[i].text,
                        'unit': defaultUnit[i]
                      }).match({
                        'recipe_item_id': map[0]['id'],
                        'recipe_id': recipe_id
                      });
                    });
              } else {
                await supabase
                    .from(RecipeItemTable().TABLENAME)
                    .insert({
                      'name': ingredient,
                      'recipe_id': recipe_id,
                      'importance': null
                    })
                    .select('id, name')
                    .then((map) async {
                      await supabase.from(AmountTable().TABLENAME).insert({
                        'recipe_item_id': map[0]['id'],
                        'recipe_id': recipe_id,
                        'amount': amountController[i].text,
                        'unit': defaultUnit[i]
                      });
                    });
              }
            }

            if (wholeRecipe.recipeItem.length > ingredients.length) {
              var difference =
                  wholeRecipe.recipeItem.length - ingredients.length;
              var reversedRecipeItems =
                  new List.from(wholeRecipe.recipeItem.reversed);

              for (var i = 0; i < difference; i++) {
                await supabase.from(AmountTable().TABLENAME).delete().match({
                  'recipe_item_id': reversedRecipeItems[i].id
                }).whenComplete(() async => await supabase
                    .from(RecipeItemTable().TABLENAME)
                    .delete()
                    .match({'id': reversedRecipeItems[i].id}));
              }
            }

// Recipe manual
            var recipe_manual_id;
            await supabase
                .from('recipe_manual')
                .update({'steps': manualStepsController.length})
                .match({'recipe_id': recipe_id})
                .select('id')
                .then((map) async {
                  recipe_manual_id = map[0]['id'];
                });

            for (var i = 0; i < manualSteps.length; i++) {
              if (wholeRecipe.recipeManualSteps.length > i &&
                  wholeRecipe.recipeManualSteps.elementAt(i).id != null) {
                print(wholeRecipe.recipeManualSteps[i].id);
                // recipe manual steps
                await supabase.from('recipe_manual_steps').update({
                  'step': manualStepsController[i].text,
                }).match({
                  'manual_id': recipe_manual_id,
                  'id': wholeRecipe.recipeManualSteps[i].id
                }).whenComplete(() async {});
                // });
              } else {
                await supabase.from('recipe_manual_steps').insert({
                  'step': manualStepsController[i].text,
                  'manual_id': recipe_manual_id
                });
              }

              // TODO shopping list and calendar
            }

            if (wholeRecipe.recipeManualSteps.length > manualSteps.length) {
              var difference =
                  wholeRecipe.recipeManualSteps.length - manualSteps.length;
              var reversedRecipeManualSteps =
                  new List.from(wholeRecipe.recipeManualSteps.reversed);

              for (var i = 0; i < difference; i++) {
                await supabase
                    .from('recipe_manual_steps')
                    .delete()
                    .match({'id': reversedRecipeManualSteps[i].id});
              }
            }
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
          'number_of_people': numberOfPeopleDropdownValue,
          "created_from_household": Service.user.household,
        })
        .select('id')
        .onError((error, stackTrace) => print("no data"))
        .then((value) async {
          recipe_id = value[0]['id'];

          insertCategories(recipe_id);

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
                      return new Future.value();
                    });
                  });
            });
          });
        });
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

  Future<void> insertCategories(int recipe_id) async {
    List<dynamic> insert = [];

    categoryController.selectedOptions.forEach((element) {
      insert.add(
          {'recipe_id': recipe_id, 'category_id': int.parse(element.value!)});
    });

    await supabase
        .from('recipe_category')
        .delete()
        .eq('recipe_id', recipe_id)
        .select()
        .then((value) async {
          await supabase
              .from('recipe_category') //
              .insert(insert);
        })
        .whenComplete(() => Future.value())
        .onError((error, stackTrace) {});
  }
}
