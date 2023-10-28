import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';

enum MyThemeKeys { LIGHT, DARK }

class MyThemes {
  static var primaryColor = MyThemes.defaultPrimaryColor;
  static final defaultPrimaryColor = Color.fromRGBO(129, 199, 132, 1);

  static var secondaryColor = MyThemes.defaultSecondaryColor;
  static final defaultSecondaryColor = Colors.black;

  static final canvasBackgroundColor = Colors.grey[850];

  static var customTheme = MyThemes.darkTheme;
  static final ThemeData darkTheme = ThemeData(
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSwatch().copyWith(
        primary: primaryColor,
        secondary: primaryColor.withOpacity(0.5),
        // secondary: const Colors.yellow.shade700,
        brightness: Brightness.dark,
      ),
      dataTableTheme: DataTableThemeData(
          // dataTextStyle: TextStyle(color: primaryColor),
          ),
      primarySwatch: kToDark,
      searchBarTheme: SearchBarThemeData(
        backgroundColor:
            MaterialStateColor.resolveWith((states) => Colors.black),
        textStyle: MaterialStateProperty.resolveWith(
            (states) => TextStyle(color: Colors.white)),

        // textStyle: MaterialStateProperty.resolveWith(
        //     (states) => TextStyle(color: Colors.green)) //
      ) //
      );

  static final ThemeData lightTheme = ThemeData(
    primaryColor: Colors.grey,
    brightness: Brightness.dark,
    highlightColor: Colors.white,
    backgroundColor: Colors.black54,
    textSelectionTheme: TextSelectionThemeData(selectionColor: Colors.grey),
  );

  static getThemeData(Color primary, Color primaryContrast) {
    MyThemes.primaryColor = primary;
    MyThemes.secondaryColor = primaryContrast;
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

  static var ThemedCircularProgressIndicator = Padding(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: CircularProgressIndicator(color: MyThemes.primaryColor));

  static HistoryConfig history = new HistoryConfig(
      Colors.white, primaryColor.withOpacity(1), Colors.grey[850]!);

  static CalendarConfig calendar = new CalendarConfig(Colors.black);
}

class HistoryConfig {
  final Color textColor;
  final Color barColor;
  final Color chartBackgroundColor;

  HistoryConfig(this.textColor, this.barColor, this.chartBackgroundColor) {}
}

class CalendarConfig {
  final Color textColor;

  CalendarConfig(this.textColor) {}
}
