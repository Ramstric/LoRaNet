<?php

// Conexion a la base de datos
$link = mysqli_connect('localhost', 'RamonHdez', '1605', 'test');

// Error en la conexion
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

// Query a la base de datos
$query = mysqli_query($link, "SELECT * FROM (SELECT * FROM myTable ORDER BY id DESC LIMIT 30) AS temp ORDER BY id ASC;");

$data = array();
while($enr = mysqli_fetch_assoc($query)){
    $a = array($enr['id_dispositivo'], $enr['hora'], $enr['temperatura'], $enr['rojo'], $enr['verde'], $enr['azul'] );
    array_push($data, $a);
}

echo json_encode($data);
