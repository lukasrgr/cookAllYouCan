import 'package:cook_all_you_can/index/overview/calendar/calendar.dart';
import 'package:cook_all_you_can/index/overview/history/history.dart';
import 'package:cook_all_you_can/index/overview/overview/overview.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:cook_all_you_can/index/overview/shared/utils.dart';
import 'package:cook_all_you_can/index/overview/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Index extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Index> {
  // Initial Navigation
  int _selectedIndex = 0;

  @override
  initState() {
    super.initState();
    updateRecipes();
  }

  buildNavigation() {
    switch (_selectedIndex) {
      case 0:
        return Overview();
      case 1:
        return ShoppingList();
      case 2:
        return Calendar();
      case 3:
        return History();
    }
  }

  /// Navigationbar
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
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
