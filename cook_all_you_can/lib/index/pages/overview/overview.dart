import 'dart:developer';

import 'package:cook_all_you_can/index/pages/overview/recipe/show/show.dart';
import 'package:cook_all_you_can/index/pages/shared/service/service.dart'
    as Service;
import 'package:cook_all_you_can/index/pages/shared/service/service.dart';
import 'package:cook_all_you_can/index/pages/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:multi_dropdown/multiselect_dropdown.dart';
import 'package:multi_dropdown/widgets/selection_chip.dart';
import 'package:multi_select_flutter/chip_field/multi_select_chip_field.dart';
import 'package:multi_select_flutter/util/multi_select_item.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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
  var recipes2;
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
                    // child: MyHomePage(title: 'Loading Overlay'),
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
                    future: recipes2,
                    builder: (BuildContext context,
                        AsyncSnapshot<List<Recipe>> snapshot) {
                      List<Widget> children = <Widget>[];

                      children.add(Padding(
                        padding: const EdgeInsets.all(15.0),
                        child: SearchAnchor(
                            viewBackgroundColor: MyThemes.canvasBackgroundColor,
                            viewSurfaceTintColor:
                                MyThemes.canvasBackgroundColor,
                            builder: (BuildContext context,
                                SearchController controller) {
                              return FocusScope(
                                  child:
                                      // return
                                      SearchBar(
                                          // backgroundColor:
                                          //     MaterialStateProperty.resolveWith(
                                          //         (states) => Colors.transparent
                                          //         // ?.withBlue(0)
                                          //         // .withGreen(0)
                                          //         ),
                                          // // backgroundColor:
                                          // //     MaterialStateProperty.resolveWith(
                                          // //         (states) => Colors),Pth
                                          // textStyle:
                                          //     MaterialStateProperty.resolveWith(
                                          //         (states) => TextStyle(
                                          //             color: Colors.white)),
                                          controller: controller,
                                          padding:
                                              const MaterialStatePropertyAll<
                                                      EdgeInsets>(
                                                  EdgeInsets.symmetric(
                                                      horizontal: 16.0)),
                                          // onTap: () {
                                          //   focusNode.requestFocus();
                                          // },
                                          onChanged: (query) {
                                            // Popup, for extended filters
                                            setState(() {
                                              if (query.isEmpty &&
                                                  categoryController
                                                      .selectedOptions
                                                      .isEmpty) {
                                                filteredRecipes = recipes;
                                              } else {
                                                filteredRecipes = recipes
                                                    .where((element) => element
                                                        .name
                                                        .toLowerCase()
                                                        .contains(query
                                                            .toLowerCase()))
                                                    .toList();
                                              }
                                            });
                                          },
                                          leading: const Icon(Icons.search,
                                              color: Colors.white),
                                          trailing: <Widget>[]));
                            },
                            suggestionsBuilder: (BuildContext context,
                                SearchController controller) {
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

                      children.add(
                        MultiSelectChipField<ValueItem?>(
                          items: Service.Service.category
                              .map((e) => MultiSelectItem<ValueItem>(
                                  new ValueItem(
                                      label: e.name, value: e.id.toString()),
                                  e.name))
                              .toList(),
                          icon: Icon(Icons.check),
                          chipColor: MyThemes.canvasBackgroundColor,
                          showHeader: false,
                          chipShape: MyThemes.roundedRectangleBorder,
                          decoration: BoxDecoration(boxShadow: [
                            BoxShadow(
                                blurStyle: BlurStyle.outer,
                                color: MyThemes.primaryColor,
                                blurRadius: 10)
                          ]),
                          textStyle: TextStyle(
                            color: MyThemes.textColor,
                          ),
                          selectedTextStyle:
                              TextStyle(color: MyThemes.primaryColor),
                          onTap: (List<ValueItem?> values) {
                            // return null;
                            setState(() {
                              if (values.isEmpty) {
                                filteredRecipes = recipes;
                              } else {
                                filteredRecipes = recipes.where((element) {
                                  for (var option in values) {
                                    for (var category in element.category!) {
                                      if (option?.value ==
                                          category.id.toString()) {
                                        return true;
                                      }
                                    }
                                  }
                                  return false;
                                }).toList();
                              }
                            });
                            return true;
                          },
                        ),
                      );

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
                                // subtitle: Text('Beschreibung'),
                              )));
                        }
                      }

                      // children.sort((a,b)=> a.key);

                      return Center(
                          child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: children));
                    }))));
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
      switch (category.name) {
        case 'Meat':
          icons.add(
              Icon(Icons.kebab_dining, size: size, color: Colors.brown[300]));
          break;
        case 'Vegan':
          icons.add(Icon(Icons.local_pizza_outlined,
              size: size, color: Colors.green[800]));
          break;
        case 'Veggie':
          icons.add(
              Icon(Icons.ramen_dining, size: size, color: Colors.lightGreen));
          break;
        case 'Cooking':
          icons.add(
              Icon(Icons.soup_kitchen, size: size, color: Colors.red[300]));
          break;
        case 'Baking':
          icons.add(Icon(Icons.bakery_dining_sharp,
              size: size, color: Colors.brown[300]));
          break;
        case 'Fast-Food':
          icons.add(
              Icon(Icons.fastfood_outlined, size: size, color: Colors.orange));
          break;
        default:
          icons.add(Icon(Icons.question_mark, size: size, color: Colors.black));
          break;
      }
    }

    return icons;
  }

  void updateRecipes() async {
    recipes = [];

    await supabase
        .from(RecipeTable().TABLENAME)
        .select(
            'name, prep_time, number_of_people,id,created_from_household,recipe_category(id,category(name, id))')
        .then((value) async {
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
      recipes2 = new Future.value(recipes);
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
