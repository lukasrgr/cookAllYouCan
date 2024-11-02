import 'dart:developer';

import 'package:cook_all_you_can/index/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:multi_dropdown/multiselect_dropdown.dart';

class Searchbar extends StatefulWidget {
  late final List<Recipe> recipes;
  final Function(List<Recipe> val)? callback;

  Searchbar({super.key, required this.callback, required this.recipes}) {}

  @override
  State<Searchbar> createState() => _SearchBarState(this.recipes);
}

class _SearchBarState extends State<Searchbar> {
  MultiSelectController categoryController = new MultiSelectController();
  List<Recipe> filteredRecipes = [];
  List<Recipe> recipes = [];

  _SearchBarState([List<Recipe>? recipes]) {
    this.recipes = recipes!;
  }

  @override
  Widget build(BuildContext context) {
    return SearchAnchor(
        viewBackgroundColor: MyThemes.canvasBackgroundColor,
        viewSurfaceTintColor: MyThemes.canvasBackgroundColor,
        builder: (BuildContext context, SearchController controller) {
          return FocusScope(
              child: SearchBar(
                  controller: controller,
                  padding: const MaterialStatePropertyAll<EdgeInsets>(
                      EdgeInsets.symmetric(horizontal: 16.0)),
                  onChanged: (query) {
                    // Popup, for extended filters
                    setState(() {
                      if (query.isEmpty &&
                          categoryController.selectedOptions.isEmpty) {
                        filteredRecipes = widget.recipes;
                      } else {
                        filteredRecipes = widget.recipes
                            .where((Recipe element) => element.name
                                .toLowerCase()
                                .contains(query.toLowerCase()))
                            .toList();
                      }
                      this.widget.callback!(filteredRecipes);
                    });
                  },
                  leading: const Icon(Icons.search, color: Colors.white),
                  trailing: <Widget>[]));
        },
        suggestionsBuilder:
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
        });
  }
}
