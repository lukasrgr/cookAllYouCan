// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'package:cook_all_you_can/recipe/create/createRecipe.dart';
import 'package:cook_all_you_can/recipe/create/test.dart';
import 'package:cook_all_you_can/shoppinglist/shoppinglist.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'button.dart';
import 'recipe/create/createRecipe.dart';

void main() {
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
          primarySwatch: Colors.blue, scaffoldBackgroundColor: Colors.white),
      initialRoute: '/',
      routes: {
        // '/': (context) => Homescreen(),
        '/details': (context) => const ShoppingList(),
      },
    );
  }
}
