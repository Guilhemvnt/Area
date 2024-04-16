import 'home.dart';
import 'main.dart';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

class PasswordTextField extends StatefulWidget {
  final String hintText;
  final TextEditingController controller;

  const PasswordTextField({
    Key? key,
    required this.hintText,
    required this.controller,
  }) : super(key: key);

  @override
  _PasswordTextFieldState createState() => _PasswordTextFieldState();
}

class _PasswordTextFieldState extends State<PasswordTextField> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 310.0,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 33, 70, 101),
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: TextField(
        controller: widget.controller,
        obscureText: true,
        decoration: InputDecoration(
          hintText: widget.hintText,
          border: InputBorder.none,
          hintStyle: const TextStyle(
            color: Colors.white70,
            fontFamily: 'Montserrat',
          ),
        ),
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class CustomTextField extends StatelessWidget {
  final String hintText;
  final TextEditingController controller; // Add this controller

  const CustomTextField(
      {Key? key, required this.hintText, required this.controller})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 310.0,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 33, 70, 101),
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: TextField(
        controller: controller, // Use the provided controller
        decoration: InputDecoration(
          hintText: hintText,
          border: InputBorder.none,
          hintStyle: const TextStyle(
            color: Colors.white70,
            fontFamily: 'Montserrat',
          ),
        ),

        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class CustomLoginButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  const CustomLoginButton({
    Key? key,
    required this.label,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 310.0,
      height: 50.0,
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 77, 224, 133),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: TextButton(
        onPressed: onPressed,
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 18.0,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}

Widget roundedSignInButton(Buttons buttonName, Function onPressed) {
  return SizedBox(
    width: 310.0,
    height: 50.0,
    child: ClipRRect(
      borderRadius: BorderRadius.circular(13.0),
      child: SignInButton(
        buttonName,
        onPressed: onPressed,
      ),
    ),
  );
}

class SignInForm extends StatefulWidget {
  const SignInForm({Key? key}) : super(key: key);

  @override
  _SignInFormState createState() => _SignInFormState();
}

class _SignInFormState extends State<SignInForm> {
  bool keepSignedIn = false;
  TextEditingController loginController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  Future<void> onLoginBtnContainerClick() async {
    final url = Uri.parse("http://$ipAddress:$port/login");
    final login = loginController.text;
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
          builder: (context) => HomePage(token: token),
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
            title: const Text('Account Does Not Exists'),
            content: const Text(
                "Account does not exists, try to register on the Register page."),
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

  Future<void> connectGoogle() async {
    final url = Uri.parse("http://$ipAddress:$port/google_login");

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final token = data['token'];

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => HomePage(token: token),
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
            title: const Text('Warning'),
            content: const Text(
                "Unable to connect to Google."),
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

                    const SizedBox(height: 100.0),

                    Text(
                      'Sign in',
                      style: GoogleFonts.montserrat(
                        fontSize: 42.0,
                        fontWeight: FontWeight.w600,
                      ),
                    ),

                    const SizedBox(height: 40.0),

                    Text(
                      'Sign in and start managing your workflows!',
                      style: GoogleFonts.montserrat(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 40.0),

                    CustomTextField(
                      hintText: 'login',
                      controller:
                          loginController, // Pass the password controller
                    ),

                    const SizedBox(height: 30.0),

                    PasswordTextField(
                      hintText: 'Password',
                      controller:
                          passwordController, // Pass the password controller
                    ),

                    const SizedBox(height: 10.0),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Checkbox(
                          value: keepSignedIn,
                          activeColor: const Color.fromARGB(255, 33, 70, 101),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4.5),
                          ),
                          onChanged: (bool? newValue) {
                            setState(() {
                              keepSignedIn = newValue ?? false;
                            });
                          },
                        ),
                        Padding(
                          padding: const EdgeInsets.only(right: 50.0),
                          child: Text(
                            'Remember me',
                            style: GoogleFonts.montserrat(
                              fontSize: 14.0,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            () {
                              // logic should now go here
                            };
                          },
                          child: Text(
                            'Forgot Password?',
                            style: GoogleFonts.montserrat(
                              fontSize: 14.0,
                              fontWeight: FontWeight.w500,
                              color: const Color.fromARGB(255, 33, 70, 101),
                            ),
                          ),
                        ),
                      ],
                    ),

                    // end

                    const SizedBox(height: 10.0),

                    CustomLoginButton(
                      label: 'Sign in',
                      onPressed:
                          onLoginBtnContainerClick, // Pass the click handler
                    ),

                    const SizedBox(height: 30.0),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          width: 140,
                          height: 1,
                          color: Colors.grey,
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 8.0),
                          child: Text(
                            'or',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                        Container(
                          width: 140,
                          height: 1,
                          color: Colors.grey,
                        ),
                      ],
                    ),

                    const SizedBox(height: 30.0),
                    roundedSignInButton(Buttons.Google, () {
                      connectGoogle();
                    }),

                    const SizedBox(height: 10.0),
                    roundedSignInButton(Buttons.AppleDark, () {
                      // changePage(context);
                    }),

                    const SizedBox(height: 10.0),
                    roundedSignInButton(Buttons.Microsoft, () {
                      // changePage(context);
                    }),

                    const SizedBox(height: 50.0),

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
