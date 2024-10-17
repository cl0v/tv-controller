// ignore_for_file: library_private_types_in_public_api

import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:vector_math/vector_math.dart' as math;
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketPage extends StatefulWidget {
  const WebSocketPage({super.key});

  @override
  _WebSocketPageState createState() => _WebSocketPageState();
}

class _WebSocketPageState extends State<WebSocketPage> {
  final TextEditingController _ipController = TextEditingController();
  WebSocketChannel? channel;
  bool isCursorMovingEnabled = false;
  double sensitivity = 0.5;
  String? connectionStatus;
  StreamSubscription? gyroscopeSubscription;
  DateTime lastMouseMovement = DateTime.now();

  @override
  void initState() {
    super.initState();
    _ipController.text = "192.168.52.109"; // Default IP
  }

  void connectToWS() {
    setState(() {
      connectionStatus = "Connecting...";
    });
    try {
      channel = WebSocketChannel.connect(
        Uri.parse('ws://${_ipController.text}:8080'),
      );
      channel!.stream.listen(
        (message) {
          // Handle incoming messages if needed
        },
        onDone: () {
          setState(() {
            connectionStatus = "Disconnected";
            channel = null;
          });
        },
        onError: (error) {
          setState(() {
            connectionStatus = "Connection failed";
            channel = null;
          });
        },
      );
      setState(() {
        connectionStatus = "Connected";
      });
    } catch (e) {
      setState(() {
        connectionStatus = "Connection failed";
      });
    }
  }

  void sendMessage(Map<String, dynamic> data) {
    channel?.sink.add(jsonEncode(data));
  }

  void sendMouseMovement(double x, double y, DateTime timestamp) {
    var seconds = timestamp.difference(lastMouseMovement).inMicroseconds / (pow(10, 6));
    lastMouseMovement = timestamp;

    x = (math.degrees(x * seconds));
    y = (math.degrees(y * seconds));

    const double thresholdX = 0.1;
    const double thresholdY = 0.1;

    if (x.abs() <= thresholdX) x = 0;
    if (y.abs() <= thresholdY) y = 0;

    final data = {
      "event": "MouseMotionMove",
      "axis": {"x": x, "y": y}
    };

    if (isCursorMovingEnabled) {
      sendMessage(data);
    }
  }

  void startGyroscopeListening() {
    gyroscopeSubscription = gyroscopeEventStream(samplingPeriod: SensorInterval.gameInterval).listen((GyroscopeEvent event) {
      sendMouseMovement(event.z * -1, event.x * -1, event.timestamp);
    });
  }

  void stopGyroscopeListening() {
    gyroscopeSubscription?.cancel();
    gyroscopeSubscription = null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Presentation Remote'),
        actions: [
          IconButton(
            onPressed: connectToWS,
            icon: const Icon(Icons.refresh),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: _ipController,
                decoration: InputDecoration(
                  labelText: 'Server IP Address',
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.connect_without_contact),
                    onPressed: connectToWS,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Status: ${connectionStatus ?? "Not connected"}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              TextField(
                onSubmitted: (text) {
                  sendMessage({"keyboardTypeEvent": true, "message": text});
                },
                decoration: const InputDecoration(labelText: 'Type text'),
              ),
              const SizedBox(height: 20),
              Text('Sensitivity: ${sensitivity.toStringAsFixed(2)}'),
              Slider(
                value: sensitivity,
                min: 0.01,
                max: 1,
                onChanged: (v) {
                  setState(() {
                    sensitivity = v;
                  });
                  sendMessage({"changeSensitivityEvent": v});
                },
              ),
              const SizedBox(height: 20),
              Center(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      isCursorMovingEnabled = !isCursorMovingEnabled;
                    });
                    if (isCursorMovingEnabled) {
                      sendMessage({"event": "MouseMotionStart"});
                      startGyroscopeListening();
                    } else {
                      sendMessage({"event": "MouseMotionStop"});
                      stopGyroscopeListening();
                    }
                  },
                  child: Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCursorMovingEnabled ? Colors.green : Colors.grey,
                    ),
                    child: Center(
                      child: Text(
                        isCursorMovingEnabled ? 'Stop Cursor' : 'Start Cursor',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton(
                    onPressed: () => sendMessage({"leftClickEvent": true}),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                    child: const Text('Left Click'),
                  ),
                  ElevatedButton(
                    onPressed: () => sendMessage({"rightClickEvent": true}),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                    child: const Text('Right Click'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton(
                    onPressed: () => sendMessage({"shortcut": "previous_slide"}),
                    child: const Icon(Icons.arrow_back),
                  ),
                  ElevatedButton(
                    onPressed: () => sendMessage({"shortcut": "next_slide"}),
                    child: const Icon(Icons.arrow_forward),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => sendMessage({"shortcut": "start_presentation"}),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                child: const Text('Start Presentation'),
              ),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: () => sendMessage({"shortcut": "end_presentation"}),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                child: const Text('End Presentation'),
              ),
            ],
          ),
        ),
      ),
    );
  }  

  @override
  void dispose() {
    channel?.sink.close();
    gyroscopeSubscription?.cancel();
    _ipController.dispose();
    super.dispose();
  }
}