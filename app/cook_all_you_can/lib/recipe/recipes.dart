import 'dart:io';

import 'package:cook_all_you_can/button.dart';
import 'package:cook_all_you_can/calendar/calendar.dart';
import 'package:cook_all_you_can/recipe/showRecipe.dart';
import 'package:cook_all_you_can/settings/settings.dart';
import 'package:cook_all_you_can/shared/shared.dart';
import 'package:cook_all_you_can/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../shared/database/table.dart';
import 'create/createRecipe.dart';

class Ingredient {
  String name;
  String amount;
  String unit;
  Ingredient(this.name, this.amount, this.unit);
}

class Recipe {
  String name;
  dynamic prep_time;
  dynamic rating;
  int number_of_people;
  int id;
  Recipe(
      this.name, this.prep_time, this.rating, this.number_of_people, this.id);
}

class RecipeItem {
  String name;
  int recipe_id;
  int id;
  RecipeItem(this.name, this.recipe_id, this.id);
}

class RecipeAmount {
  int recipe_item_id;
  int recipe_id;
  double amount;
  String unit;
  RecipeAmount(this.recipe_item_id, this.recipe_id, this.amount, this.unit);
}

class RecipeManual {
  int steps;
  int recipe_id;
  RecipeManual(this.steps, this.recipe_id);
}

class RecipeManualStep {
  int id;
  int manual_id;
  String step;
  RecipeManualStep(this.id, this.manual_id, this.step);
}

class Homescreen extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Homescreen> {
  var primaryColor = Colors.green[300];

  List<Ingredient> ingredients = [Ingredient("", "", "")];
  TextEditingController nameController = TextEditingController();
  TextEditingController generalController = TextEditingController();

  List<Recipe> recipes = [];
  int _selectedIndex = 0;
  var recipes2;
  final supabase = Supabase.instance.client;

  @override
  initState() {
    // updateRecipes();
    super.initState();
    updateRecipes();
  }

  void updateRecipes() async {
    recipes = [];
    await supabase
        .from(RecipeTable().TABLENAME)
        .select('name, prep_time, number_of_people, id')
        .then((value) => {
              for (var i = 0; i < value.length; i++)
                {
                  recipes.add(Recipe(
                      value[i]['name'].toString(),
                      value[i]['prep_time'] != null
                          ? value[i]['prep_time'].toString() + ' Min.'
                          : '-',
                      value[i]['rating'] != null
                          ? value[i]['rating'].toString()
                          : '-',
                      value[i]['number_of_people'],
                      value[i]['id']))
                }
            });

    /// Weird behavior of setState
    setState(() {
      recipes2 = new Future.value(recipes);
    });
  }

  void updateIngredients() {
    setState(() {
      ingredients.add(Ingredient("Zutat", "", ""));
    });
  }

  /// Find better solution for grouped deleting
  Future<void> removeRecipe(String recipeName) async {
    int recipe_id = 0;
    var future = new Future.value();
    await supabase
        .from(RecipeTable().TABLENAME)
        .select('id')
        .match({'name': recipeName}).then((value) async {
      recipe_id = value[0]['id'];
      await supabase
          .from(CalendarDayWithEvent().TABLENAME)
          .delete()
          .match({'recipe_id': recipe_id});
      await supabase
          .from(AmountTable().TABLENAME)
          .delete()
          .match({'recipe_id': recipe_id});
      await supabase
          .from(RecipeItemTable().TABLENAME)
          .delete()
          .match({'recipe_id': recipe_id});
      await supabase
          .from("recipe_manual")
          .select('id')
          .match({'recipe_id': recipe_id}).then((value) async {
        print(value);
        if (value.length > 0) {
          var manual_id = value[0]['id'];
          await supabase
              .from("recipe_manual_steps")
              .delete()
              .match({'manual_id': manual_id});
          await supabase
              .from("recipe_manual")
              .delete()
              .match({'recipe_id': recipe_id});
        }

        await supabase
            .from(CalendarDayWithEvent().TABLENAME)
            .delete()
            .match({'recipe_id': recipe_id}).whenComplete(() async {
          await supabase
              .from(RecipeTable().TABLENAME)
              .delete()
              .match({'id': recipe_id}).whenComplete(() {
            setState(() {
              future = new Future.delayed(Duration(seconds: 1));
            });
          });
        });
      }).onError((error, stackTrace) {
        print(error);
        return Future.error(error!);
      });
    });

    return future;
  }

  buildViews2() {
    /// TODO use original suggested navigation
    if (_selectedIndex == 0) {
      return SingleChildScrollView(
          child: FutureBuilder<List<Recipe>>(
              future: recipes2,
              builder:
                  (BuildContext context, AsyncSnapshot<List<Recipe>> snapshot) {
                List<Widget> children = <Widget>[];

                children.add(Card(
                    child: ListTile(
                  leading: Icon(Icons.add_circle_outline),
                  iconColor: primaryColor,
                  title: Text("Rezept hinzufügen"),
                  onTap: () {
                    Navigator.of(context)
                        .push(
                          MaterialPageRoute(
                            builder: (context) => RecipePopUp(dummyWholeRecipe),
                          ),
                        )
                        .whenComplete(() => {this.updateRecipes()});
                  },
                )));

                if (snapshot.hasData) {
                  for (var recipe in recipes) {
                    children.add(Card(
                        shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.all(Radius.elliptical(20, 20))),
                        child: ListTile(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => RecipePage(recipe.name),
                              ),
                            );
                          },
                          onLongPress: () {
                            confirmRemovePopUp(context).then((value) {
                              if (value) {
                                var snackbar = showNotification(
                                    context, "Rezept wird entfernt");
                                removeRecipe(recipe.name).then((value) => {
                                      updateRecipes(),
                                    });
                              }
                            });
                          },
                          title: Column(
                            children: [
                              Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(recipe.name,
                                        style: TextStyle(
                                            fontSize: 18,
                                            color: primaryColor,
                                            overflow: TextOverflow.clip)),

                                    /// TODO implement rating
                                    // Row(
                                    //   children: [
                                    //     Icon(Icons.star_border_outlined),
                                    //     Icon(Icons.star_border_outlined),
                                    //     Icon(Icons.star_border_outlined),
                                    //     Icon(Icons.star_border_outlined),
                                    //     Icon(Icons.star_border_outlined),
                                    //     Text("Rating geht noch nicht")
                                    //   ],
                                    // ),
                                    Row(
                                      children: [
                                        Icon(Icons.access_time, size: 20),
                                        Text(
                                          recipe.prep_time,
                                          style: TextStyle(fontSize: 12),
                                        ),
                                      ],
                                    )
                                  ]),
                            ],
                          ),
                          // subtitle: Text('Beschreibung'),
                        )));
                  }
                } else if (snapshot.hasError) {
                  children = <Widget>[];
                } else {
                  children = <Widget>[
                    Padding(
                        padding: EdgeInsets.symmetric(vertical: 20),
                        child: Container())
                  ];
                }

                return Center(
                    child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: children,
                ));
              }));

      ///
    } else if (_selectedIndex == 1) {
      return ShoppingList();
    } else if (_selectedIndex == 2) {
      return Calendar();
    }
  }

  /// Navigationbar
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: Row(children: [
          Text('Cook all you can'),
          Spacer(),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                onPressed: () {
                  var snackbar =
                      showNotification(context, "Not implemented", Colors.grey);
                  // Navigator.of(context).push(
                  //   MaterialPageRoute(
                  //     builder: (context) => Settings(),
                  //   ),
                  // );
                },
                icon: const Icon(Icons.settings, color: Colors.black),
              ),
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                onPressed: () {
                  var snackbar =
                      showNotification(context, "Not implemented", Colors.grey);
                },
                icon:
                    const Icon(Icons.account_circle_sharp, color: Colors.black),
              ),
            ],
          ),
        ]),
        backgroundColor: primaryColor,
      ),
      body: buildViews2(),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.food_bank_outlined),
            label: 'Rezepte',
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.list), label: 'Einkaufsliste'),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Kalendar',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: primaryColor,
        onTap: _onItemTapped,
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    buildViews2();
  }
}
