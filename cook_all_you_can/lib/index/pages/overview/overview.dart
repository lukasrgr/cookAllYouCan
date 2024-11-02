import 'dart:developer';

import 'package:cook_all_you_can/index/pages/overview/recipe/show/show.dart';
import 'package:cook_all_you_can/index/pages/shared/components/searchbar.dart';
import 'package:cook_all_you_can/index/pages/shared/service/service.dart'
    as Service;
import 'package:cook_all_you_can/index/pages/shared/service/service.dart';
import 'package:cook_all_you_can/index/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:multi_dropdown/multiselect_dropdown.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../shared/components/multiSelectChipField.dart';
import '../shared/database/table.dart';
import '../shared/loadingOverlay/loadingOverlay.dart';
import 'recipe/create/create.dart';

class Overview extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Overview> {
  MultiSelectController categoryController = new MultiSelectController();

  List<Recipe> recipes = [];
  List<Recipe> filteredRecipes = [];
  var result;
  final supabase = Supabase.instance.client;

  @override
  initState() {
    super.initState();
    updateRecipes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          backgroundColor: MyThemes.primaryColor.withOpacity(0.9),
          shape: MyThemes.roundedRectangleBorder,
          onPressed: () => Navigator.of(context)
              .push(
                MaterialPageRoute(
                  builder: (context) => LoadingOverlay(
                    child: RecipePopUp(dummyWholeRecipe),
                  ),
                ),
              )
              .whenComplete(() => this.updateRecipes()),
          isExtended: true,
          child: Icon(
            Icons.add_outlined,
            color: Colors.black,
          ),
        ),
        body: SingleChildScrollView(
            child: Padding(

                /// Extend List height to be able to see last item properly: floatingActionButton
                padding: EdgeInsets.fromLTRB(0, 0, 0, 100),
                child: FutureBuilder<List<Recipe>>(
                    future: result,
                    builder: (BuildContext context,
                        AsyncSnapshot<List<Recipe>> snapshot) {
                      List<Widget> children = <Widget>[];

                      children.add(Padding(
                          padding: const EdgeInsets.all(15.0),
                          child: Searchbar(
                              recipes: this.recipes, callback: updateFilter)));

                      children.add(MultiSelectChipFields(
                        recipes: recipes,
                        callback: updateFilter,
                      ));

                      if (snapshot.hasData) {
                        for (var recipe in filteredRecipes) {
                          children.add(Card(
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.all(
                                      Radius.elliptical(20, 20))),
                              child: ListTile(
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          RecipePage(recipe.name),
                                    ),
                                  );
                                },
                                onLongPress: () {
                                  confirmRemovePopUp(context).then((value) {
                                    if (value) {
                                      var snackbar = showNotification(
                                          context, "Rezept wird entfernt");
                                      removeRecipe(recipe.name)
                                          .then((value) => {
                                                updateRecipes(),
                                              });
                                    }
                                  });
                                },
                                title: Column(
                                  children: [
                                    Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
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
                                          createDetailsFromRecipe(recipe)
                                        ]),
                                  ],
                                ),
                              )));
                        }
                      }

                      return Center(
                          child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: children));
                    }))));
  }

  void updateFilter(List<Recipe> param) {
    setState(() {
      this.filteredRecipes = param;
    });
  }

  Widget createDetailsFromRecipe(Recipe recipe) {
    return Row(
      children: [
        Icon(Icons.access_time, size: 20),
        Text(
          " " + recipe.prep_time,
          style: TextStyle(fontSize: 12),
        ),
        if (recipe.category != null) ...[
          Spacer(),
          ...getCategoryIcons(recipe.category!),
        ]
      ],
    );
  }

  List<Icon> getCategoryIcons(List<Service.Category> categories) {
    const double size = 30;

    List<Icon> icons = [];

    for (var category in categories) {
      icons.add(Service.Category.getCategoryIcon(category));
    }

    return icons;
  }

  void updateRecipes() async {
    recipes = [];

    await supabase.rpc('get_recipes10').then((value) {
      for (final recipe in value) {
        debugger();
        recipes.add(Recipe(
            recipe['recipe_name'].toString(),
            recipe['prep_time'] != null
                ? recipe['prep_time'].toString() + ' Min.'
                : '-',
            recipe['rating'] != null ? recipe['rating'].toString() : '-',
            recipe['number_of_people'],
            recipe['created_from_household'],
            recipe['recipe_id'],
            recipe['categories']
                    ?.map((key, value) => new Service.Category(key, value)) ??
                []));
      }
      for (var i = 0; i < value.length; i++) {
        List<dynamic> category = value[i]['recipe_category']
            .map((el) => el['category'])
            .toList()
            .map((el) => new Service.Category(el['id'], el['name']))
            .toList();

        recipes.add(Recipe(
            value[i]['name'].toString(),
            value[i]['prep_time'] != null
                ? value[i]['prep_time'].toString() + ' Min.'
                : '-',
            value[i]['rating'] != null ? value[i]['rating'].toString() : '-',
            value[i]['number_of_people'],
            value[i]['created_from_household'],
            value[i]['id'],
            category.cast<Service.Category>()));
      }
    });

    setState(() {
      filteredRecipes = recipes;
      result = new Future.value(recipes);
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
          .from('recipe_category')
          .delete()
          .match({'recipe_id': recipe_id});
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
}
