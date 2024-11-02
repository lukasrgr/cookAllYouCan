import 'package:cook_all_you_can/index/pages/calendar/calendar.dart';
import 'package:cook_all_you_can/index/pages/history/history.dart';
import 'package:cook_all_you_can/index/pages/overview/overview.dart';
import 'package:cook_all_you_can/index/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/utils.dart';
import 'package:cook_all_you_can/index/pages/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Index extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Index> {
  final supabase = Supabase.instance.client;
  // Initial Navigation
  int _selectedIndex = 0;
  late Future<List<String>> category; // = Future.value([]);

  @override
  initState() {
    super.initState();
  }

  buildNavigation() {
    switch (_selectedIndex) {
      // case 0:
      //   return Home();
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
          // BottomNavigationBarItem(
          //   icon: Icon(Icons.abc),
          //   label: 'Home',
          // ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bakery_dining_sharp),
            label: 'Rezepte',
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.shopping_cart_outlined), label: 'Einkaufsliste'),
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
        backgroundColor: MyThemes.canvasBackgroundColor,
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    buildNavigation();
  }

  // void getCategories() async {
  //   List<Category> categories = [];
  //   await supabase //
  //       .from('category') //
  //       .select('name, id')
  //       .then((list) {
  //     for (var value in list) {
  //       categories.add(new Category(
  //         value['id'],
  //         value['name'],
  //       ));
  //     }
  //   });

  //   // setState(() {
  //   Service.category = categories;
  //   // });
  // }
}
