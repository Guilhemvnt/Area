import 'welcome.dart';
import 'package:flutter/material.dart';

int port = 8080;
String ipAddress = "localhost";

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Stack(
            children: [
              WelcomePage(),
            ],
          ),
        ),
      ),
    );
  }
}
