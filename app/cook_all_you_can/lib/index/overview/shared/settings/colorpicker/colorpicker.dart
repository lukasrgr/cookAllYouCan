import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:flutter/material.dart';

enum MyThemeKeys { LIGHT, DARK }

class MyThemes {
  static var customTheme = MyThemes.darkTheme;
  static final ThemeData darkTheme = ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: primaryColor,
      secondary: primaryColor.withOpacity(0.5),
      // secondary: const Colors.yellow.shade700,
      brightness: Brightness.dark,
    ),
    dataTableTheme: DataTableThemeData(
      dataTextStyle: TextStyle(color: primaryColor),
    ),
    primarySwatch: kToDark,
  );

  static final ThemeData lightTheme = ThemeData(
    primaryColor: Colors.grey,
    brightness: Brightness.dark,
    highlightColor: Colors.white,
    backgroundColor: Colors.black54,
    textSelectionTheme: TextSelectionThemeData(selectionColor: Colors.grey),
  );

  static getThemeData(Color primary, Color primaryContrast) {
    return ThemeData(
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: primary,
          secondary: primary.withOpacity(0.5),
          // secondary: const Colors.yellow.shade700,
          brightness: Brightness.dark,
        ),
        dataTableTheme: DataTableThemeData(
          dataTextStyle: TextStyle(color: primary),
        ),
        primarySwatch: kToDark);
  }

  /** TODO move into own file and cleanup */
  static var primaryColor = MyThemes.defaultPrimaryColor;
  static final defaultPrimaryColor = Color(0xFF81C784);
  static var secondaryColor = MyThemes.defaultSecondaryColor;
  static final defaultSecondaryColor = Colors.black;
}
