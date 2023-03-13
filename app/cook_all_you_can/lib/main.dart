// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'package:cook_all_you_can/recipe/recipes.dart';
import 'package:cook_all_you_can/shoppinglist/shoppinglist.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'button.dart';

Future<void> main() async {
  //add your keys here
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cook All You Can',
      home: Homescreen(),
      theme: ThemeData(
          colorScheme: ColorScheme.fromSwatch().copyWith(
            primary: Colors.green[300],
            // secondary: const Colors.yellow.shade700,
            brightness: Brightness.dark,
          ),
          dataTableTheme: DataTableThemeData(
            dataTextStyle: TextStyle(color: Colors.green[300]),
          )),
      initialRoute: '/',
      routes: {
        // '/': (context) => Homescreen(),
        '/details': (context) => const ShoppingList(),
      },
    );
  }
}
