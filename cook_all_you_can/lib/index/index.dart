import 'package:cook_all_you_can/index/overview/calendar/calendar.dart';
import 'package:cook_all_you_can/index/overview/history/history.dart';
import 'package:cook_all_you_can/index/overview/overview.dart';
import 'package:cook_all_you_can/index/overview/recipe/show/showRecipe.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:cook_all_you_can/index/overview/shared/utils.dart';
import 'package:cook_all_you_can/index/overview/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'overview/recipe/create/createRecipe.dart';
import 'overview/shared/database/table.dart';

class Index extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Index> {
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

  buildNavigation() {
    if (_selectedIndex == 0) {
      return Overview();
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
      // floatingActionButton: FloatingActionButton(
      //   backgroundColor: MyThemes.primaryColor.withOpacity(0.9),
      //   shape: roundedRectangleBorder,
      //   onPressed: () => Navigator.of(context)
      //       .push(
      //         MaterialPageRoute(
      //           builder: (context) => RecipePopUp(dummyWholeRecipe),
      //         ),
      //       )
      //       .whenComplete(() => this.updateRecipes()),
      //   isExtended: true,
      //   child: Icon(
      //     Icons.add_outlined,
      //     color: Colors.black,
      //   ),
      // ),
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
