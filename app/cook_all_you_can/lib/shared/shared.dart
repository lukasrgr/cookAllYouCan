import 'package:flutter/material.dart';

List<DropdownMenuItem<String>> get dropdownItems {
  List<DropdownMenuItem<String>> menuItems = [
    DropdownMenuItem(child: Text("g"), value: "Gramm"),
    DropdownMenuItem(child: Text("Stk"), value: "Stück"),
    DropdownMenuItem(child: Text("l"), value: "Liter"),
  ];
  return menuItems;
}
