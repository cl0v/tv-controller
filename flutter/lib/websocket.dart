// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:vector_math/vector_math.dart' as math;
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketPage extends StatefulWidget {
  @override
  _WebSocketPageState createState() => _WebSocketPageState();
}

class _WebSocketPageState extends State<WebSocketPage> {
  final macIP = "192.168.52.109";
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
        child: SingleChildScrollView(
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
                height: 24,
              ),
              GestureDetector(
                onTap: () {
                  if (!isCursorMovingEnabled) {
                    setState(() {
                      isCursorMovingEnabled = true;
                    });

                    channel?.sink.add(jsonEncode({
                      "event": "MouseMotionStart",
                    }));

                    acelerometerSubscription =
                        gyroscopeEventStream(samplingPeriod: SensorInterval.gameInterval).listen((GyroscopeEvent event) {
                      sendMouseMovement(event.z * -1, event.x * -1, event.timestamp);
                    });
                  } else {
                    setState(() {
                      isCursorMovingEnabled = false;
                    });
                    acelerometerSubscription?.cancel();
                    acelerometerSubscription = null;

                    channel?.sink.add(jsonEncode({
                      "event": "MouseMotionStop",
                    }));
                  }
                },
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(300),
                    color: isCursorMovingEnabled ? Colors.green : Colors.grey,
                  ),
                ),
              ),
              SizedBox(height: 24,),
              SizedBox(
                height: 120,
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
                        height: 210,
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
                        height: 210,
                      ),
                    ),
                  ],
                ),
              ),

            ],

          ),
        ),
      ),
    );
  }

  StreamSubscription? acelerometerSubscription;

  DateTime lastMouseMovement = DateTime.now();

  sendMouseMovement(double x, double y, DateTime timestamp) {
    // X é Z e pra direita é negativo
    // X é Y e pra cima é positivo

    var seconds = timestamp.difference(lastMouseMovement).inMicroseconds / (pow(10, 6));
    lastMouseMovement = timestamp;

    x = (math.degrees(x * seconds));
    y = (math.degrees(y * seconds));


    final double threshholdX = 0.1;
    final double threshholdY = 0.1;

    if(x.abs() <= threshholdX){
      x = 0;
    }
    
    if(y.abs() <= threshholdY){
      y = 0;
    }


    final data = {
      "event": "MouseMotionMove",
      "axis": {
        "x": x,
        "y": y,
      }
    };
    print(data);

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
