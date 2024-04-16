import 'main.dart';
import 'login.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RegisterForm extends StatefulWidget {
  const RegisterForm({Key? key}) : super(key: key);

  @override
  _RegisterFormState createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  TextEditingController registerController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  Future<void> onLoginBtnContainerClick() async {
    final url = Uri.parse("http://$ipAddress:$port/register");
    final login = registerController.text;
    final password = passwordController.text;

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': login,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final token = data['token'];

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => const MainApp(),
        ),
        (Route<dynamic> route) => false,
      );
    } else if (response.statusCode == 400) {
      final Map<String, dynamic> data = json.decode(response.body);
      final error = data['error'];

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Account Already Exists'),
            content: const Text(
                "Account already exists, try to login on the Login page."),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Column(
          children: [
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Image.asset('assets/images/ol.png'),
                    const SizedBox(height: 130.0),
                    Text(
                      'Register',
                      style: GoogleFonts.montserrat(
                        fontSize: 42.0,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    Container(
                      alignment: Alignment.center,
                      child: Text(
                        'This is the registration page,\nyou can create an account here.',
                        style: GoogleFonts.montserrat(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    Container(
                      alignment: Alignment.centerRight,
                      child: const SizedBox(height: 100.0),
                    ),
                    const SizedBox(height: 30.0),
                    CustomTextField(
                        hintText: 'Username', controller: registerController),
                    const SizedBox(height: 30.0),
                    PasswordTextField(
                        hintText: 'Password', controller: passwordController),
                    const SizedBox(height: 100.0),
                    CustomLoginButton(
                      label: 'Create an account',
                      onPressed: () {
                        onLoginBtnContainerClick();
                      },
                    ),
                    const SizedBox(height: 40.0),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(
                            builder: (context) => const MainApp(),
                          ),
                          (Route<dynamic> route) => false,
                        );
                      },
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          color: Color.fromARGB(255, 33, 70, 101),
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Image.asset('assets/images/lol.png'),
          ],
        ),
      ),
    );
  }
}
