var topo_data=
{
    "host": [
        {
            "name": "compute1",
            "id": "334-443-222",
            "ip": "192.168.53.21",
            "pty1": "pty1",
            "pty2": "pty2",
			"nic":
			[
			    {
				"name":"eth1",
				"mac":"00:24:E8:5A:4C:4B"
				},
				{
				"name":"eth0",
				"mac":"00:50:56:47:95:34"
				},
			],
            "vm": [
                {
                    "name": "vm1",
                    "id": "1",
                    "type": "centos",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
                {
                    "name": "vm2",
                    "id": "2",
                    "type": "FireWall",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
                {
                    "name": "vm3",
                    "id": "3",
                    "type": "ubuntu",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
                {
                    "name": "vm4",
                    "id": "4",
                    "type": "FireWall",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
                {
                    "name": "vm5",
                    "id": "5",
                    "type": "DPI",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                }
            ],
            "switch": {
                "mac": "00:00:00:66:45:67",
                "int_ports": [
                    "local",
                    "port11",
                    "port8",
                    "port10",
                    "port9"
                ],
                "phy_ports": [
                    {"name":"eth2","re_mac":"00:83:00:66:45:68"},
					{"name":"eth2","re_mac":"00:00:00:66:45:68"}
                ]
            }
        },
        {
            "name": "compute2",
            "id": "334-443-222",
            "ip": "192.168.53.21",
            "pty1": "pty1",
            "pty2": "pty2",
            "vm": [
                {
                    "name": "vm6",
                    "id": "6",
                    "type": "FireWall",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
				{
                    "name": "vm8",
                    "id": "8",
                    "type": "centos",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port10"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port11"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }					
                }
            ],
            "switch": {
                "mac": "00:00:00:66:45:68",
                "int_ports": [
                    "local",
                    "port11",
                    "port8",
                    "port10",
                    "port9"
                ],
                "phy_ports": [
                    {"name":"eth2","re_mac":"00:00:00:66:45:67"},
                    {"name":"eth1","re_mac":"00:00:00:66:45:69"}
                ]
            }
        },
		{
            "name": "compute3",
            "id": "334-443-222",
            "ip": "192.168.53.21",
            "pty1": "pty1",
            "pty2": "pty2",
            "vm": [
                {
                    "name": "vm9",
                    "id": "9",
                    "type": "centos",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port9"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port8"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }
                },
                {
                    "name": "vm10",
                    "id": "10",
                    "type": "ubuntu",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port10"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port11"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }					
                },
				{
                    "name": "vm11",
                    "id": "34-544-76",
                    "type": "DPI",
                    "pty": "bilibala",
                    "ovs_ports": [
                        {
                            "name": "udev-9732",
                            "outway": "port10"
                        },
                        {
                            "name": "udev-4567",
                            "outway": "port11"
                        }
                    ],
                    "mgr_port": {
                        "name": "udev-6653",
                        "outway": "br-xx"
                    }					
                }
            ],
            "switch": {
                "mac": "00:00:00:66:45:69",
                "int_ports": [
                    "local",
                    "port11",
                    "port8",
                    "port10",
                    "port9"
                ],
                "phy_ports": [
                    {"name":"eth1","re_mac":"00:00:00:66:45:68"},
					{"name":"eth2","re_mac":"00:00:00:55:45:96"}
                ]
            }
        }
    ]
}
;