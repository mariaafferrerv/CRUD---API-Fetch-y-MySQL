
<?php
// Nada de espacios ni líneas antes de este <?php

header("Content-Type: application/json; charset=utf-8");

require_once "modelo/productos.php";

$accion = isset($_POST['Accion']) ? $_POST['Accion'] : "";


//Respuestas JSON con success, message, errors
$producto = new Producto();
$respuesta = [
    "success" => false,
    "message" => "Acción no válida",
    "accion"  => $accion
];

switch ($accion) {
    case "Guardar":
        $producto->setDatos($_POST);
        $respuesta = $producto->guardar();
        $respuesta["accion"] = "Guardar";
        break;

    case "Modificar":
        $producto->setDatos($_POST);
        $respuesta = $producto->editar();
        $respuesta["accion"] = "Modificar";
        break;

    case "Buscar":
        $texto = isset($_POST['texto']) ? $_POST['texto'] : "";
        $respuesta = $producto->buscar($texto);
        $respuesta["accion"] = "Buscar";
        break;

    case "Listar":
        $respuesta = $producto->buscar("");
        $respuesta["accion"] = "Listar";
        break;

    case "Obtener":
        $id = isset($_POST['id']) ? $_POST['id'] : 0;
        $respuesta = $producto->obtenerPorId($id);
        $respuesta["accion"] = "Obtener";
        break;
}

echo json_encode($respuesta);
