<?php

// Conexion a la base de datos
$link = mysqli_connect('localhost', 'RamonHdez', '1605', 'test');

// Error en la conexion
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

// Query a la base de datos
$query = mysqli_query ($link, "SELECT * FROM myTable WHERE hora BETWEEN '12:01:00' AND '18:00:00'");

// Imprimir los datos en formato XML
while($enr = mysqli_fetch_assoc($query)){
    echo "<id DispositivoID='$enr[id_dispositivo]'> <fecha>$enr[fecha]</fecha> <hora>$enr[hora]</hora> <temperatura>$enr[temperatura]</temperatura> <rojo>$enr[rojo]</rojo> <verde>$enr[verde]</verde> <azul>$enr[azul]</azul> </id>". PHP_EOL;
}

?>
