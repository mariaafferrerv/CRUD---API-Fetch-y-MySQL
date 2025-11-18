<?php
require_once "conexion.php";

//Clases Producto implementadas
class Producto {
    private $id;
    private $codigo;
    private $producto;
    private $precio;
    private $cantidad;

    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    // Cargar datos desde $_POST
    public function setDatos($data) {
        $this->id       = isset($data['id']) ? $data['id'] : null;
        $this->codigo   = isset($data['codigo']) ? trim($data['codigo']) : "";
        $this->producto = isset($data['producto']) ? trim($data['producto']) : "";
        $this->precio   = isset($data['precio']) ? $data['precio'] : 0;
        $this->cantidad = isset($data['cantidad']) ? $data['cantidad'] : 0;
    }

    private function validar() {
        $errores = [];

        if ($this->codigo === "") {
            $errores['codigo'] = "El código es obligatorio.";
        }
        if ($this->producto === "") {
            $errores['producto'] = "El nombre es obligatorio.";
        }
        if (!is_numeric($this->precio) || $this->precio <= 0) {
            $errores['precio'] = "El precio debe ser mayor que 0.";
        }
        if (!is_numeric($this->cantidad) || $this->cantidad < 0) {
            $errores['cantidad'] = "La cantidad debe ser 0 o más.";
        }

        return $errores;
    }

    public function guardar() {
        $errores = $this->validar();

        if (!empty($errores)) {
            return [
                "success" => false,
                "message" => "Errores de validación.",
                "errors"  => $errores
            ];
        }

        $sql = "INSERT INTO productos (codigo, producto, precio, cantidad)
                VALUES (?, ?, ?, ?)";

        $ok = $this->db->insertSeguro($sql, [
            $this->codigo,
            $this->producto,
            $this->precio,
            $this->cantidad
        ]);

        return [
            "success" => $ok,
            "message" => $ok ? "Producto guardado." : "No se pudo guardar."
        ];
    }

    public function editar() {
        $errores = $this->validar();
        if (empty($this->id)) {
            $errores['id'] = "ID inválido.";
        }

        if (!empty($errores)) {
            return [
                "success" => false,
                "message" => "Errores de validación.",
                "errors"  => $errores
            ];
        }

        $sql = "UPDATE productos
                SET codigo = ?, producto = ?, precio = ?, cantidad = ?
                WHERE id = ?";

        $ok = $this->db->updateSeguro($sql, [
            $this->codigo,
            $this->producto,
            $this->precio,
            $this->cantidad,
            $this->id
        ]);

        return [
            "success" => $ok,
            "message" => $ok ? "Producto actualizado." : "No se pudo actualizar."
        ];
    }

    public function buscar($texto = "") {
        if ($texto === "") {
            $sql = "SELECT * FROM productos ORDER BY id DESC";
            $rows = $this->db->query($sql);
        } else {
            $sql = "SELECT * FROM productos
                    WHERE codigo LIKE ? OR producto LIKE ?
                    ORDER BY id DESC";
            $like = "%".$texto."%";
            $rows = $this->db->query($sql, [$like, $like]);
        }

        return [
            "success" => true,
            "data"    => $rows
        ];
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM productos WHERE id = ?";
        $rows = $this->db->query($sql, [$id]);

        if (count($rows) === 1) {
            return [
                "success" => true,
                "data"    => $rows[0]
            ];
        }

        return [
            "success" => false,
            "message" => "Producto no encontrado."
        ];
    }
}
