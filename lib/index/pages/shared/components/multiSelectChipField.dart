import 'dart:developer';

import 'package:cook_all_you_can/index/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:multi_dropdown/multiselect_dropdown.dart';
import 'package:multi_select_flutter/chip_field/multi_select_chip_field.dart';
import 'package:multi_select_flutter/util/multi_select_item.dart';

import '../service/service.dart';

class MultiSelectChipFields extends StatefulWidget {
  late final List<Recipe> recipes;
  late final Function(List<Recipe> val)? callback;

/**
 * Recipe categories
 * 
 * @callback used to update recipes
 * 
 * @recipe the recipes
 */
  MultiSelectChipFields(
      {super.key, required this.callback, required this.recipes}) {}

  @override
  State<MultiSelectChipFields> createState() =>
      _MultiSelectChipFieldsState(this.recipes);
}

class _MultiSelectChipFieldsState extends State<MultiSelectChipFields> {
  MultiSelectController categoryController = new MultiSelectController();
  List<Recipe> filteredRecipes = [];
  List<Recipe> recipes = [];

  _MultiSelectChipFieldsState([List<Recipe>? recipes]) {
    this.recipes = recipes!;
  }

  @override
  Widget build(BuildContext context) {
    return MultiSelectChipField<ValueItem?>(
      items: Service.category
          .map((e) => MultiSelectItem<ValueItem>(
              new ValueItem(label: e.name, value: e.id.toString()), e.name))
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
      selectedTextStyle: TextStyle(color: MyThemes.primaryColor),
      onTap: (List<ValueItem?> values) {
        // return null;
        setState(() {
          if (values.isEmpty) {
            filteredRecipes = recipes;
          } else {
            filteredRecipes = recipes.where((element) {
              for (var option in values) {
                for (var category in element.category!) {
                  if (option?.value == category.id.toString()) {
                    return true;
                  }
                }
              }
              return false;
            }).toList();
          }

          widget.callback!(filteredRecipes);
        });
        return true;
      },
    );
  }
}
