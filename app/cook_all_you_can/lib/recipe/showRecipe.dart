import 'package:cook_all_you_can/recipe/create/createRecipe.dart';
import 'package:cook_all_you_can/recipe/recipes.dart';
import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:cook_all_you_can/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:mysql_client/mysql_protocol.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class WholeRecipeContent {
  Recipe recipe;
  List<RecipeItem> recipeItem = [];
  RecipeManual recipeManual;
  List<RecipeManualStep> recipeManualSteps = [];
  List<RecipeAmount> amount = [];

  WholeRecipeContent(this.recipe, this.recipeItem, this.recipeManual,
      this.recipeManualSteps, this.amount);
}

class RecipePage extends StatefulWidget {
  String name = "";
  RecipePage(String name, {super.key}) {
    this.name = name;
  }

  @override
  State<RecipePage> createState() => _RecipePopUpState(this.name);
}

class _RecipePopUpState extends State<RecipePage> {
  String recipe_name = "";

  _RecipePopUpState(String name) {
    this.recipe_name = name;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Row(children: [
            Text(this.recipe_name),
          ]),
          backgroundColor: Colors.green[300],
        ),
        body: ShowRecipe(recipe_name));
  }
}

class ShowRecipe extends StatefulWidget {
  String recipe_name = "";
  ShowRecipe(String recipe_name, {super.key}) {
    this.recipe_name = recipe_name;
  }

  @override
  ShowRecipeState createState() {
    return ShowRecipeState(recipe_name);
  }
}

class ShowRecipeState extends State<ShowRecipe> {
  final supabase = Supabase.instance.client;

  var wholeRecipe2;
  late WholeRecipeContent wholeRecipe;

  List<String> list = <String>['1', '2', '3', '4'];
  String dropdownValue = '1';
  String originalNumberOfPeople = '';

  String recipe_name = "";

  ShowRecipeState(String recipe_name) {
    this.recipe_name = recipe_name;
  }

  @override
  initState() {
    // updateRecipes();
    super.initState();
    getRecipe();
  }

  getRecipe() async {
    Recipe recipe;
    List<RecipeItem> recipeItem = [];
    RecipeManual recipeManual;
    List<RecipeAmount> amount = [];
    List<RecipeManualStep> recipeManualSteps = [];

    int recipe_id = 0;
    await supabase
        .from(RecipeTable().TABLENAME)
        .select('name, prep_time, id, number_of_people')
        .match({'name': this.recipe_name})

        ///
        .then((value) async {
      if ((value as List).isEmpty) {
        wholeRecipe2 = new Future.value();
        return;
      }
      dropdownValue = value[0]['number_of_people'].toString();
      originalNumberOfPeople = dropdownValue;
      recipe_id = value[0]['id'];
      recipe = new Recipe(value[0]['name'], value[0]['prep_time'],
          value[0]['rating'], value[0]['number_of_people'], value[0]['id']);

      await supabase
          .from(RecipeItemTable().TABLENAME)
          .select('*')
          .match({'recipe_id': recipe_id})

          ///
          .then((map) async {
        /// Iterate over array
        // List<RecipeItem> ingredients = [];
        for (var i = 0; i < map.length; i++) {
          var recipe_item_id = map[i]['id'];
          recipeItem
              .add(new RecipeItem(map[i]['name'], recipe_id, recipe_item_id));
        }

        await supabase
            .from(AmountTable().TABLENAME)
            .select('id, amount, recipe_item_id, unit')
            .match({'recipe_id': recipe_id})

            ///
            .then((map) async {
          for (var i = 0; i < map.length; i++) {
            amount.add(new RecipeAmount(
                map[i]['recipe_item_id'],
                recipe_id,
                map[i]['amount'] is int
                    ? (map[i]['amount'] as int).toDouble()
                    : map[i]['amount'],
                map[i]['unit']));
          }
        });
      });

      await supabase
          .from("recipe_manual")
          .select('steps, id')
          .match({'recipe_id': recipe_id}).then((map) async {
        if ((map as List).isEmpty) {
          wholeRecipe = WholeRecipeContent(recipe, recipeItem,
              new RecipeManual(0, recipe_id), recipeManualSteps, amount);
          return;
        }

        var recipe_manual_id = map[0]['id'];

        recipeManual = new RecipeManual(map[0]['steps'], recipe_id);

        await supabase
            .from("recipe_manual_steps")
            .select("step")
            .match({'manual_id': recipe_manual_id}).then((map) {
          for (var i = 0; i < map.length; i++) {
            recipeManualSteps
                .add(new RecipeManualStep(recipe_manual_id, map[i]['step']));
          }
        }).whenComplete(() => {
                  setState(() {
                    print(recipeItem);
                    wholeRecipe = WholeRecipeContent(recipe, recipeItem,
                        recipeManual, recipeManualSteps, amount);
                    wholeRecipe2 = new Future.value(wholeRecipe);
                  })
                });
      });
    }).onError((error, stackTrace) {
      return new Future.value();
    });
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);

    // Build a Form widget using the _formKey created above.
    return SingleChildScrollView(
        child: FutureBuilder<WholeRecipeContent>(
            future: wholeRecipe2,
            builder: (BuildContext context,
                AsyncSnapshot<WholeRecipeContent> snapshot) {
              List<DataRow> generalInformation = [];

              /// TODO: category
              List<DataRow> ingredients = [];
              List<Widget> manualSteps = [];

              if (!snapshot.hasData) {
                return Center(
                    child: Column(children: [
                  Padding(
                      padding: EdgeInsets.symmetric(vertical: 20),
                      child: CircularProgressIndicator())
                ]));
              } else {
                generalInformation.add(DataRow(
                  cells: <DataCell>[
                    DataCell(Icon(Icons.people)),
                    DataCell(Icon(Icons.access_time)),
                    DataCell(Icon(Icons.star_border))
                  ],
                ));

                // ignore: unnecessary_null_comparison
                if (snapshot.hasData) {
                  if (wholeRecipe.recipe != null &&
                      wholeRecipe.amount.isNotEmpty) {
                    generalInformation.add(DataRow(
                      cells: <DataCell>[
                        DataCell(Container(child: buildDropdown(context)
                            // Text(wholeRecipe.recipe.number_of_people
                            //     .toString()),
                            )),
                        DataCell(Text(
                            wholeRecipe.recipe.prep_time.toString() + " min")),
                        DataCell(Text(wholeRecipe.recipe.rating.toString()))
                      ],
                    ));
                  }

                  if (wholeRecipe.recipeItem.isNotEmpty &&
                      wholeRecipe.amount.isNotEmpty) {
                    for (var x = 0; x < wholeRecipe.recipeItem.length; x++) {
                      var amount = wholeRecipe.amount.firstWhere(
                          (element) =>
                              element.recipe_item_id ==
                              wholeRecipe.recipeItem[x].id,
                          orElse: null);
                      ingredients.add(DataRow(
                        cells: <DataCell>[
                          DataCell(
                            ///
                            Text(amount.amount.toString() + " " + amount.unit),
                          ),
                          DataCell(Text(wholeRecipe.recipeItem[x].name)),
                        ],
                      ));
                    }
                  }
                  if (wholeRecipe.recipeManualSteps.isNotEmpty) {
                    for (var x = 0;
                        x < wholeRecipe.recipeManualSteps.length;
                        x++) {
                      //
                      manualSteps.add(Container(
                              width: mediaQuery.size.width * 0.9,
                              padding: EdgeInsets.all(10),
                              child: Column(
                                children: [
                                  Text(
                                    'Schritt ${x + 1}',
                                    style: TextStyle(
                                        color: primaryColor, fontSize: 20),
                                  ),
                                  Padding(padding: EdgeInsets.only(bottom: 10)),
                                  Text(
                                    wholeRecipe.recipeManualSteps[x].step,
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ],
                              ))
                          //   DataRow(cells: <DataCell>[
                          //   DataCell(Row(
                          //     mainAxisAlignment: MainAxisAlignment.start,
                          //     verticalDirection: VerticalDirection.down,
                          //     children: [
                          //       Column(
                          //           verticalDirection: VerticalDirection.down,
                          //           children: [
                          //             Text(
                          //               "Schritt ${x + 1}: ",
                          //               style: TextStyle(color: Colors.white),
                          //             ),
                          //           ]),
                          //       Column(
                          //           mainAxisAlignment: MainAxisAlignment.center,
                          //           children: [
                          //             Container(
                          //               width: mediaQuery.size.width * 0.7,
                          //               height: mediaQuery.size.width * 0.7,
                          //               child: Text(
                          //                 wholeRecipe.recipeManualSteps[x].step,
                          //                 style: TextStyle(color: Colors.white),
                          //               ),
                          //             )
                          //           ])
                          //     ],
                          //   ))
                          // ]));
                          );
                      // ]));
                    }
                  }
                }
              }
              return Center(
                  child: Card(
                      child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                    IconButton(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => RecipePopUp(wholeRecipe),
                          ),
                        );
                      },
                      icon: const Icon(Icons.edit),
                    ),
                    DataTable(
                        headingRowHeight: 0,
                        dividerThickness: 0.0,
                        columns: <DataColumn>[
                          DataColumn(label: Container()),
                          DataColumn(label: Container()),
                          DataColumn(label: Container()),
                        ],
                        rows: generalInformation),
                    DataTable(
                        dataRowHeight: 30,
                        columns: const <DataColumn>[
                          DataColumn(
                            label: Expanded(
                              child: Text(
                                'Zutaten',
                                style: TextStyle(fontStyle: FontStyle.italic),
                              ),
                            ),
                          ),
                          DataColumn(
                            label: Expanded(
                              child: Text(
                                '',
                              ),
                            ),
                          ),
                        ],
                        rows: ingredients),

                    // Container(
                    //     width: mediaQuery.size.width * 0.5,
                    //     child: DataTable(
                    //         dataRowHeight: 60,
                    //         columns: const <DataColumn>[
                    //           DataColumn(
                    //             // SizedBox(
                    //             // width: mediaQuery.size.width * 1,
                    //             // child: manualSteps,
                    //             // ),
                    //             label: Text(
                    //               'Schritte',
                    //               style: TextStyle(fontStyle: FontStyle.italic),
                    //             ),
                    //           ),
                    //         ],
                    //         rows: manualSteps)),
                    // DataTable(
                    //     dataRowHeight: 60,
                    //     columns: const <DataColumn>[
                    //       DataColumn(
                    //         label: Expanded(
                    //           child: Text(
                    //             'Schritte',
                    //             style: TextStyle(fontStyle: FontStyle.italic),
                    //           ),
                    //         ),
                    //       ),
                    //     ],
                    //     rows: manualSteps),
                    ...manualSteps
                  ])));
            }));
  }

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
              wholeRecipe.amount.forEach((element) {
                print(element.amount);
                element.amount = (element.amount *
                    (int.parse(value!) / int.parse(dropdownValue))) as double;
              });
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
