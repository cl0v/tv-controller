import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          sliderTheme: SliderThemeData(
            showValueIndicator: ShowValueIndicator.always,
          ),
          // This is the theme of your application.
          //
          // TRY THIS: Try running your application with "flutter run". You'll see
          // the application has a purple toolbar. Then, without quitting the app,
          // try changing the seedColor in the colorScheme below to Colors.green
          // and then invoke "hot reload" (save your changes or press the "hot
          // reload" button in a Flutter-supported IDE, or press "r" if you used
          // the command line to start the app).
          //
          // Notice that the counter didn't reset back to zero; the application
          // state is not lost during the reload. To reset the state, use hot
          // restart instead.
          //
          // This works for code too, not just values: Most code changes can be
          // tested with just a hot reload.
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          useMaterial3: true,
        ),
        home: WebSocketPage());
  }
}


class WebSocketPage extends StatefulWidget {
  @override
  _WebSocketPageState createState() => _WebSocketPageState();
}

class _WebSocketPageState extends State<WebSocketPage> {
  final macIP = "192.168.52.103";
  WebSocketChannel? channel;
  // Substitua pelo IP do seu servidor WebSocket

  @override
  void initState() {
    super.initState();
  }

  connectToWS([String? ipAdd]) {
    ipAdd ??= macIP;
    setState(() {
      channel = WebSocketChannel.connect(
        Uri.parse('ws://$macIP:8080'),
      );
    });
  }

  double sensibilidade = 0.5;

  bool isCursorMovingEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WebSocket Flutter'),
        actions: [
          IconButton(
            onPressed: () {
              connectToWS();
            },
            icon: Icon(Icons.refresh),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Visibility(
              visible: channel == null,
              child: TextField(
                onSubmitted: connectToWS,
                decoration: const InputDecoration(
                  labelText:
                      'Digite o IP do dispositivo (ipconfig getifaddr en0)',
                ),
              ),
            ),

            // Widget para exibir mensagens recebidas
            // StreamBuilder(
            //   stream: channel?.stream,
            //   builder: (context, snapshot) {
            //     return Text(snapshot.hasData
            //         ? '${snapshot.data}'
            //         : 'Nenhuma mensagem recebida');
            //   },
            // ),
            TextField(
              onSubmitted: (text) {
                // Envia mensagem para o WebSocket quando o usuário submeter
                final data = {
                  "keyboardTypeEvent": true,
                  "message": text,
                };
                channel?.sink.add(jsonEncode(data));
              },
              decoration: const InputDecoration(labelText: 'Usar teclado'),
            ),
            RotatedBox(
              quarterTurns: -1,
              child: Slider(
                label: sensibilidade.toStringAsFixed(2),
                value: sensibilidade,
                min: 0.01,
                max: 1,
                onChanged: (v) {
                  setState(() {
                    sensibilidade = v;
                  });

                  var data = {"changeSensitivityEvent": v};
                  channel?.sink.add(jsonEncode(data));
                },
              ),
            ),
            SizedBox(
              height: 80,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () {
                      final data = {
                        "leftClickEvent": true,
                      };
                      channel?.sink.add(jsonEncode(data));
                    },
                    child: Container(
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(10),
                          bottomLeft: Radius.circular(10),
                        ),
                        color: Colors.red,
                      ),
                      width: 150,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      final data = {
                        "rightClickEvent": true,
                      };
                      channel?.sink.add(jsonEncode(data));
                    },
                    child: Container(
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          topRight: Radius.circular(10),
                          bottomRight: Radius.circular(10),
                        ),
                        color: Colors.blue,
                      ),
                      width: 150,
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(
              height: 24,
            ),
            GestureDetector(
              onTapDown: (_) {
                setState(() {
                  isCursorMovingEnabled = true;
                });

                String direction = "Parado";
                // Limite de sensibilidade para considerar movimento
                double threshold = 0.01;

                channel?.sink.add(jsonEncode({"startCursorEvent": true}));
                acelerometerSubscription = gyroscopeEventStream().listen(
                  (GyroscopeEvent event) {
                    if (event.y < threshold) {
                      direction = "Esquerda (${event.y.toStringAsFixed(3)})";
                    } else if (event.y > -threshold) {
                      direction = "Direita (${event.y.toStringAsFixed(3)})";
                    } else {
                      direction = "Parado (${event.y.toStringAsFixed(3)})";
                    }

                    print(direction);
                    // Fazer um sistema de calibragem??

                    // sendMouseMovement(event.x, event.y);
                  },
                  onError: (error) {
                    setState(() {
                      isCursorMovingEnabled = false;
                    });
                  },
                  cancelOnError: true,
                );
              },
              onTapUp: (_) {
                setState(() {
                  isCursorMovingEnabled = false;
                });
                acelerometerSubscription?.cancel();
              },
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(300),
                  color: isCursorMovingEnabled ? Colors.green : Colors.grey,
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  StreamSubscription? acelerometerSubscription;

  sendMouseMovement(double x, double y) {
    final data = {
      "moveCursorEvent": {
        "x": x,
        "y": y,
      }
    };
    if (isCursorMovingEnabled) {
      channel?.sink.add(jsonEncode(data));
    }
  }

  @override
  void dispose() {
    // Fechar o canal ao sair
    channel?.sink.close();
    super.dispose();
  }
}
