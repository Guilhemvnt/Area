import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'main.dart';
import 'widgets.dart';

class CustomCard extends StatelessWidget {
  final String id;
  final String scenarioName;
  final String scenarioDescription;
  final Function(String id) onCardClicked;

  const CustomCard({
    Key? key,
    required this.id,
    required this.scenarioName,
    required this.scenarioDescription,
    required this.onCardClicked,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onCardClicked(id);
      },
      child: Stack(
        alignment: Alignment.topRight,
        children: [
          Container(
            margin: const EdgeInsets.all(16.0),
            width: double.infinity,
            height: 100.0,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12.0),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  blurRadius: 10.0,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    scenarioName,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    scenarioDescription,
                    style: const TextStyle(fontSize: 16.0),
                  ),
                ],
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.cancel, color: Colors.red), // Use the "cancel" icon for a prohibited sign
            onPressed: () {
              _showDeleteConfirmation(context);
            },
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            'Remove',
          ),
          content: Text('Do you really want to delete the Components?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                // logic will be here
                Navigator.of(context).pop();
              },
              child: Text('Yes'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('No'),
            ),
          ],
        );
      },
    );
  }
}

class ListViewWithCustomCards extends StatelessWidget {
  final List<Content> contentList;
  final String? searchText;
  final Function(String id) onCardClicked;

  const ListViewWithCustomCards({
    Key? key,
    required this.contentList,
    this.searchText,
    required this.onCardClicked,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    List<Content> filteredContent = searchText != null
        ? contentList.where((content) {
            return content.scenarioName
                    .toLowerCase()
                    .contains(searchText!.toLowerCase()) ||
                content.scenarioDescription
                    .toLowerCase()
                    .contains(searchText!.toLowerCase());
          }).toList()
        : contentList;

    filteredContent.sort((a, b) =>
        a.scenarioName.toLowerCase().compareTo(b.scenarioName.toLowerCase()));

    return ListView.builder(
      itemCount: filteredContent.length,
      itemBuilder: (context, index) {
        final content = filteredContent[index];
        return CustomCard(
          id: content.id,
          scenarioName: content.scenarioName,
          scenarioDescription: content.scenarioDescription,
          onCardClicked: onCardClicked,
        );
      },
    );
  }
}

class HomePage extends StatefulWidget {
  final String? token;

  const HomePage({Key? key, required this.token}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class Content {
  final String id;
  final String scenarioName;
  final String scenarioDescription;

  Content({
    required this.id,
    required this.scenarioName,
    required this.scenarioDescription,
  });
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  TextEditingController searchController = TextEditingController();

  TextEditingController ipController = TextEditingController();
  TextEditingController portController = TextEditingController();

  List<Content> contentList = [];
  List<String> addedContentList = [];

  Future<void> fetchContent() async {
    final url = Uri.parse("http://$ipAddress:$port/getScenarios");
    final response = await http.get(
      url,
      headers: {
        'authorization': widget.token!,
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);

      if (data.containsKey("success") &&
          (data["success"] == true || data["success"] == "true")) {
        final Map<String, dynamic> result = data["result"];

        final List<dynamic> itemList = result["rows"];

        final List<Content> fetchedContent = itemList.map((contentData) {
          return Content(
            id: contentData['id'].toString(),
            scenarioName: contentData['scenario_name'] ?? "",
            scenarioDescription: contentData['scenario_description'] ?? "",
          );
        }).toList();

        setState(() {
          contentList.clear();
          contentList.addAll(fetchedContent);
        });
      }
    }
  }

  Future<void> deleteComponent(String componentId, String scenarioId) async {
    final url = Uri.parse("http://$ipAddress:$port/delComponent");

    final Map<String, dynamic> requestBody = {
      "component_id": componentId,
      "scenario_id": scenarioId,
    };

    final response = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        'authorization': widget.token!,
      },
      body: jsonEncode(requestBody),
    );

    if (response.statusCode == 200) {
      // Handle the successful deletion here, e.g., show a success message
      print("Deleted component with ID: $componentId from scenario ID: $scenarioId");
    } else {
      // Handle the deletion error here, e.g., show an error message
      print("Failed to delete component");
    }
  }

  Future<void> testIpAndPortValues() async {
    final testIp = ipController.text.isEmpty ? ipAddress : ipController.text;
    final testPort = portController.text.isEmpty ? port : portController.text;

    final url = Uri.parse("http://$testIp:$testPort/getUserId");

    try {
      final response = await http.get(
        url,
        headers: {
          'authorization': widget.token!,
          'Content-Type': 'application/json',
        },
      );

      print(response.statusCode);

      if (response.statusCode == 200) {
        print("ip = $testIp & port = $testPort");
      } else {
        // Invalid IP or port
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Text("Warning"),
              content: Text("The modified value is incorrect."),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: Text("OK"),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      print("Error: $e");
      // Handle the exception here, e.g., show an error message
      showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text("Error"),
            content:
                Text("An error occurred while testing IP and port values."),
            actions: <Widget>[
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text("OK"),
              ),
            ],
          );
        },
      );
    }
  }

  Future<void> sendGetRequest(String id) async {
    print(id);
    final url = Uri.parse("http://$ipAddress:$port/getComponents");

    final int scenarioNumber = int.tryParse(id) ?? 0;
    final int incrementedNumber = scenarioNumber;

    final Map<String, dynamic> requestBody = {
      "id": incrementedNumber.toString(),
    };

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'authorization': widget.token!,
      },
      body: jsonEncode(requestBody),
    );

    if (response.statusCode == 200) {
      print(response.body);
    }
  }

  Future<void> execScenario(String id) async {
    final url = Uri.parse("http://$ipAddress:$port/doScenario");

    final int scenarioNumber = int.tryParse(id) ?? 0;
    final int incrementedNumber = scenarioNumber;

    final Map<String, dynamic> requestBody = {
      "id": incrementedNumber.toString(),
    };

    print("id = " + id);

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'authorization': widget.token!,
      },
      body: jsonEncode(requestBody),
    );

    print("arf");

    if (response.statusCode == 200) {
      print(response.body);
      print("DONE");
    }
  }

  Future<void> _handleRefresh() async {
    await fetchContent();
  }

  @override
  void initState() {
    super.initState();
    fetchContent();

    // Add a listener for the Enter key in the IP input box
    ipController.addListener(() {
      if (ipController.text.isNotEmpty && ipController.text.endsWith('\n')) {
        ipController.text = ipController.text.replaceAll('\n', '');
        testIpAndPortValues();
      }
    });

    // Add a listener for the Enter key in the Port input box
    portController.addListener(() {
      if (portController.text.isNotEmpty &&
          portController.text.endsWith('\n')) {
        portController.text = portController.text.replaceAll('\n', '');
        testIpAndPortValues();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      backgroundColor: Colors.white,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: Colors.green,
        onTap: (int index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'Add',
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                SizedBox(height: 70),
                Row(
                  children: [
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        child: TextField(
                          controller: ipController,
                          decoration: InputDecoration(labelText: 'IP'),
                          onSubmitted: (value) {
                            testIpAndPortValues();
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 40),
                    Expanded(
                      child: Container(
                        child: TextField(
                          controller: portController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(labelText: 'Port'),
                          onSubmitted: (value) {
                            testIpAndPortValues();
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                  ],
                ),
              ],
            ),
          ),
          if (_currentIndex == 0)
            Expanded(
              child: Column(
                children: [
                  Container(
                    height: 5,
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: TextField(
                      controller: searchController,
                      onChanged: (value) {
                        setState(() {});
                      },
                      decoration: const InputDecoration(
                        hintText: 'Search',
                      ),
                    ),
                  ),
                  Expanded(
                    child: RefreshIndicator(
                      onRefresh: _handleRefresh,
                      child: ListViewWithCustomCards(
                        contentList: contentList,
                        searchText: searchController.text,
                        onCardClicked: execScenario,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          if (_currentIndex == 1) WidgetPage(token: widget.token!)
        ],
      ),
    );
  }
}
