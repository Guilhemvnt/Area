import 'main.dart';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

int displayMicrosoftInfo = 0;

Future<void> addComponent(String selectedOption1, String selectedOption2,
    int id, String token, String name) async {
  final url = Uri.parse("http://$ipAddress:$port/addComponent");

  final actionsMap = {
    'gmail': 'GetEmailGmail',
    'discord': 'GetMsgDiscord',
    'crypto': 'GetCrypto€',
    'teams': 'GetMsgTeams',
    'outlook': 'GetMailOutlook',
    'notebooks': 'GetNotebooks',
    'file': 'GetFiles',
  };

  String componentFirst = actionsMap[selectedOption1] ?? selectedOption1;

  final reactionsMap = {
    'gmail': 'SendEmailGmail',
    'discord': 'SendMsgDiscord',
    'teams': 'SendMsgTeams',
    'outlook': 'SendMailOutlook',
    'notebooks': 'CreateNotebook',
    'file': 'CreateFolder',
  };

  String componentSecond = reactionsMap[selectedOption2] ?? selectedOption2;

  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      body: jsonEncode({
        'component_name': name,
        'component_type': componentFirst,
        'link_to': componentSecond,
        'scenario_id': id,
      }),
    );

    if (response.statusCode == 200) {
      print("First component added successfully");
    } else {
      // Handle other response statuses if needed
      print("Error adding 1st component: ${response.statusCode}");
    }
  } catch (e) {
    print("Error making the network request: $e");
  }

  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      body: jsonEncode({
        'component_name': name,
        'component_type': componentSecond,
        'link_to': "",
        'scenario_id': id,
      }),
    );

    if (response.statusCode == 200) {
      print("Second component added successfully");
    } else {
      // Handle other response statuses if needed
      print("Error adding 2nd component: ${response.statusCode}");
    }
  } catch (e) {
    print("Error making the network request: $e");
  }
}

Widget roundedSignInButton(Buttons buttonName, Function onPressed) {
  return SizedBox(
    width: 330.0,
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

class CustomDropdownItem extends StatelessWidget {
  final String value;
  final List<String> options;
  final TextEditingController controller;
  final Function(String) onChanged;

  const CustomDropdownItem({
    Key? key,
    required this.value,
    required this.options,
    required this.controller,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150.0,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 33, 70, 101),
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: DropdownButton<String>(
        value: value,
        onChanged: (String? newValue) {
          onChanged(
              newValue!); // Call the callback function to update the value
        },
        items: options.map<DropdownMenuItem<String>>((String option) {
          return DropdownMenuItem<String>(
            value: option,
            child: Text(
              option,
              style: const TextStyle(
                color: Colors.black,
                fontFamily: 'Montserrat',
              ),
            ),
          );
        }).toList(),
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class CustomDropdownItem2 extends StatelessWidget {
  final String value;
  final List<String> options;
  final TextEditingController controller;
  final Function(String) onChanged;

  const CustomDropdownItem2({
    Key? key,
    required this.value,
    required this.options,
    required this.controller,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150.0,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 33, 70, 101),
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: DropdownButton<String>(
        value: value,
        onChanged: (String? newValue) {
          onChanged(newValue!);
        },
        items: options.map<DropdownMenuItem<String>>((String option) {
          return DropdownMenuItem<String>(
            value: option,
            child: Text(
              option,
              style: const TextStyle(
                color: Colors.black,
                fontFamily: 'Montserrat',
              ),
            ),
          );
        }).toList(),
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
  final TextEditingController controller;

  const CustomTextField({
    Key? key,
    required this.hintText,
    required this.controller,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 330.0,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 33, 70, 101),
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(13.0),
      ),
      child: TextField(
        controller: controller,
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

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  const CustomButton({
    Key? key,
    required this.label,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 330.0,
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

class WidgetPage extends StatefulWidget {
  final String token;

  const WidgetPage({
    Key? key,
    required this.token,
  }) : super(key: key);

  @override
  _WidgetPageState createState() => _WidgetPageState();
}

class _WidgetPageState extends State<WidgetPage> {
  int? scenarioId;
  String selectedOption1 = "gmail";
  String selectedOption2 = "teams";
  final TextEditingController _inputController = TextEditingController();
  String microsoftCode = "";

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  Future<void> fetchMicrosoftAuthCode() async {
    final url = Uri.parse("http://$ipAddress:$port/authMicrosoft");

    final response = await http.get(
      url,
      headers: {
        'Authorization': widget.token,
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      final info = jsonResponse['info'];

      if (info != null) {
        setState(() {
          microsoftCode = info['code'];
          displayMicrosoftInfo = 1;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(32.0),
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
              'Create a Scenario',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 30.0),
            Row(
              children: [
                const SizedBox(width: 15.0),
                Expanded(
                  child: CustomDropdownItem(
                    value: selectedOption1,
                    options: const ['gmail', 'discord', 'crypto', 'teams', 'outlook', 'notebooks', 'file'],
                    controller: _inputController,
                    onChanged: (newValue) {
                      setState(() {
                        selectedOption1 = newValue;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 10.0),
                Expanded(
                    child: CustomDropdownItem2(
                  value: selectedOption2,
                  options: const ['gmail', 'discord', 'teams', 'outlook', 'notebooks', 'file'],
                  controller: _inputController,
                  onChanged: (newValue) {
                    setState(() {
                      selectedOption2 = newValue;
                    });
                  },
                )),
                const SizedBox(width: 15.0),
              ],
            ),
            const SizedBox(height: 30.0),
            CustomTextField(
              hintText: 'Scenario Name',
              controller: _inputController,
            ),
            const SizedBox(height: 30.0),
            CustomButton(
              label: 'Add Content',
              onPressed: () async {
                final url = Uri.parse("http://$ipAddress:$port/addScenario");

                final response = await http.post(
                  url,
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': widget.token,
                  },
                  body: jsonEncode({
                    'scenario_name': _inputController.text,
                    'scenario_description':
                        "$selectedOption1 → $selectedOption2",
                  }),
                );

                if (response.statusCode == 200) {
                  final jsonResponse = json.decode(response.body);
                  final scenario = jsonResponse['scenario'];
                  final id;

                  if (scenario != null) {
                    id = scenario['id'];

                    if (id != null) {
                      setState(() {
                        scenarioId = int.tryParse(id.toString());
                      });

                      await addComponent(
                        selectedOption1,
                        selectedOption2,
                        scenarioId ?? 0,
                        widget.token,
                        _inputController.text,
                      );

                      print("Scenario added with ID: ${scenarioId.toString()}");
                    }
                  }
                }
              },
            ),
            Visibility(
              visible: displayMicrosoftInfo >= 0,
              child: Column(
                children: [
                  const SizedBox(height: 30.0),
                  roundedSignInButton(Buttons.Microsoft, () {
                    fetchMicrosoftAuthCode();
                  }),
                ],
              ),
            ),
            if (displayMicrosoftInfo == 1)
              Column(
                children: [
                  const SizedBox(height: 20.0),
                  Text(
                    microsoftCode,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20.0),
                  CustomButton(
                    label: 'Go to Microsoft Page',
                    onPressed: () async {
                      final Uri microsoftUrl =
                          Uri.parse("https://microsoft.com/devicelogin");

                      try {
                        await launchUrl(microsoftUrl);

                        setState(() {
                          displayMicrosoftInfo = -1;
                        });
                      } catch (e) {
                        print("Error launching URL: $e");
                      }
                    },
                  ),
                ],
              ),
            const SizedBox(height: 30.0),
          ],
        ),
      ),
    );
  }
}
