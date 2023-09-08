import 'package:cook_all_you_can/index/overview/calendar/calendar.dart';
import 'package:cook_all_you_can/index/overview/history/history.dart';
import 'package:cook_all_you_can/index/overview/recipe/show/showRecipe.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:cook_all_you_can/index/overview/shared/utils.dart';
import 'package:cook_all_you_can/index/overview/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'recipe/create/createRecipe.dart';
import 'shared/database/table.dart';

class Overview extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Overview> {
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

  buildNavigation() {
    var isDetailedView = false;
    Set<bool> selection = <bool>{false, true};

    /// TODO use original suggested navigation
    if (_selectedIndex == 0) {
      return SingleChildScrollView(
          child: FutureBuilder<List<Recipe>>(
              future: recipes2,
              builder:
                  (BuildContext context, AsyncSnapshot<List<Recipe>> snapshot) {
                List<Widget> children = <Widget>[];

                children.add(Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: SearchAnchor(builder:
                      (BuildContext context, SearchController controller) {
                    return SearchBar(
                      backgroundColor: MaterialStateProperty.resolveWith(
                          (states) => Colors.grey.withOpacity(0.25)),
                      textStyle: MaterialStateProperty.resolveWith(
                          (states) => TextStyle(color: Colors.white)),
                      controller: controller,
                      padding: const MaterialStatePropertyAll<EdgeInsets>(
                          EdgeInsets.symmetric(horizontal: 16.0)),
                      onTap: () {
                        // controller.openView();
                      },
                      onChanged: (_) {
                        // controller.openView();
                      },
                      leading: const Icon(Icons.search, color: Colors.white),
                      trailing: <Widget>[],
                    );
                  }, suggestionsBuilder:
                      (BuildContext context, SearchController controller) {
                    return List<ListTile>.generate(5, (int index) {
                      final String item = 'item $index';
                      return ListTile(
                        title: Text(item),
                        onTap: () {
                          setState(() {
                            controller.closeView(item);
                          });
                        },
                      );
                    });
                  }),
                ));

// TODO
                children.add(Card(
                    child: SegmentedButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStateColor.resolveWith(
                          (states) => Colors.grey)),
                  segments: [
                    ButtonSegment(
                        value: false, label: Text(''), icon: Icon(Icons.list)),
                    ButtonSegment(
                        value: true,
                        label: Text(''),
                        icon: Icon(Icons.view_list)),
                  ],
                  selected: Set.of([isDetailedView]),
                  onSelectionChanged: (newSelection) {
                    setState(() {
                      isDetailedView = newSelection.first;
                    });
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
                                            color: MyThemes.primaryColor,
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
    } else if (_selectedIndex == 3) {
      return History();
    }
  }

  /// Navigationbar
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,

      // TODO: could be expandable_floating_button
      floatingActionButton: FloatingActionButton(
        backgroundColor: MyThemes.primaryColor.withOpacity(0.9),
        shape: roundedRectangleBorder,
        onPressed: () => Navigator.of(context)
            .push(
              MaterialPageRoute(
                builder: (context) => RecipePopUp(dummyWholeRecipe),
              ),
            )
            .whenComplete(() => this.updateRecipes()),
        isExtended: true,
        child: Icon(
          Icons.add_outlined,
          color: Colors.black,
        ),
      ),
      resizeToAvoidBottomInset: false,
      appBar: getAppBar(context, "Cook All You Can"),
      body: buildNavigation(),
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
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_rounded),
            label: 'Historie',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: MyThemes.primaryColor,
        onTap: _onItemTapped,
        backgroundColor: Colors.grey[850],
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    buildNavigation();
  }
}
