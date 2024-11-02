import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DateHelper {
  static final formatString = 'yyyy-MM-dd';
  static String startDate = DateFormat(formatString).format(
      DateTime.now().subtract(Duration(days: DateTime.now().weekday - 1)));
  static String endDate = DateFormat(formatString).format(DateTime.now()
      .add(Duration(days: DateTime.daysPerWeek - DateTime.now().weekday)));

  static bool validateDateString(String value) {
    try {
      DateTime.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }
}

class Service {
  static late User user = new User(0, 'anon', "anon", '', 0);

  // ignore: todo
  // TODO: should be stored with sqflite
  static late List<Category> category = [
    new Category(2, "Vegan"),
    new Category(1, "Meat"),
    new Category(3, "Veggie"),
    new Category(4, "Baking"),
    new Category(5, "Cooking"),
    new Category(6, "Fast-Food"),
    new Category(7, "omnivor"),
    new Category(8, "High protein"),
    new Category(9, "Fish")
  ];

  static late List<Recipe_Filter> filter = [];
}

class User {
  int id;
  String userName;
  String password;
  String household;
  int household_id;

  User(
      this.id, this.userName, this.password, this.household, this.household_id);

  setHousehold(String household, int household_id) {
    this.household = household;
    this.household_id = household_id;
  }

  setUserName(String userName) {
    this.userName = userName;
  }

  // The keys must correspond to the names of the
  // columns in the database.
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userName': userName,
      'password': password,
      'household': household,
      'household_id': household_id,
    };
  }
}

class Recipe_Filter {
  int id;
  String label;
  String value;

  Recipe_Filter(this.id, this.label, this.value);

  // setHousehold(String household, int household_id) {
  //   this.household = household;
  //   this.household_id = household_id;
  // }

  // setUserName(String userName) {
  //   this.userName = userName;
  // }

  // // The keys must correspond to the names of the
  // // columns in the database.
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'label': label,
      'value': value,
    };
  }
}

// Resembles many to many - recipe and category
class Category {
  int id;
  String name;

  static final double size = 30;

  Category(this.id, this.name);

  static Icon getCategoryIcon(Category category) {
    switch (category.name) {
      case 'Meat':
        return Icon(Icons.kebab_dining, size: size, color: Colors.brown[300]);
      case 'Vegan':
        return Icon(Icons.local_pizza_outlined,
            size: size, color: Colors.green[800]);
      case 'Veggie':
        return Icon(Icons.ramen_dining, size: size, color: Colors.lightGreen);
      case 'Cooking':
        return Icon(Icons.soup_kitchen, size: size, color: Colors.red[300]);
      case 'Baking':
        return Icon(Icons.bakery_dining_sharp,
            size: size, color: Colors.brown[300]);
      case 'Fast-Food':
        return Icon(Icons.fastfood_outlined, size: size, color: Colors.orange);
      default:
        return Icon(Icons.question_mark, size: size, color: Colors.black);
    }
  }
}
