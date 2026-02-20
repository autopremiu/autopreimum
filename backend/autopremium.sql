-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2026 a las 14:43:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `autopremium`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `dv` varchar(5) DEFAULT NULL,
  `naturaleza` enum('NATURAL','JURIDICA') NOT NULL,
  `primer_nombre` varchar(50) DEFAULT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) DEFAULT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `empresa` varchar(150) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `movil` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gerente` varchar(150) DEFAULT NULL,
  `cod_identidad` varchar(20) DEFAULT NULL,
  `cod_sociedad` varchar(20) DEFAULT NULL,
  `cod_actividad` varchar(20) DEFAULT NULL,
  `cod_zona` varchar(20) DEFAULT NULL,
  `cod_municipio` varchar(20) DEFAULT NULL,
  `cod_pais` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nit`, `dv`, `naturaleza`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `empresa`, `direccion`, `telefono`, `movil`, `email`, `gerente`, `cod_identidad`, `cod_sociedad`, `cod_actividad`, `cod_zona`, `cod_municipio`, `cod_pais`, `created_at`, `updated_at`, `activo`) VALUES
(2, '', NULL, 'NATURAL', 'mario', NULL, 'lopez', NULL, '', NULL, NULL, NULL, 'mario@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-17 14:31:02', '2026-02-17 14:31:02', 1),
(3, '', NULL, 'NATURAL', 'jose ', NULL, 'lopez', NULL, NULL, NULL, NULL, NULL, 'jose@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-17 21:50:55', '2026-02-17 21:50:55', 1),
(4, '', '', 'NATURAL', 'sebastian', '', 'ocampo', '', '', '', '', '', 'sebasocampo721@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-18 15:02:29', '2026-02-18 16:05:07', 1),
(5, '10000163', '9', 'NATURAL', 'JAIME', 'EDUARDO', 'RESTREPO', 'MONTOYA', '', 'VALLES DE LA ALHAMBRA', '3137591056', '', 'EDUARDOp1j@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-18 21:53:14', '2026-02-18 21:53:14', 1),
(6, '24339286', '', 'NATURAL', 'luisa', 'fernada', 'atehortua', 'jaramillo', '', 'Cll 63 B  Nro. 10 A - 146  BR MINITAS', '3136959366', '', 'luisacomercial7@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-18 22:07:35', '2026-02-18 22:07:35', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuestas`
--

CREATE TABLE `encuestas` (
  `id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `satisfaccion` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `encuestas`
--

INSERT INTO `encuestas` (`id`, `servicio_id`, `satisfaccion`, `comentario`, `fecha`) VALUES
(3, 10, 4, 'Ningún comentario al respecto ', '2026-02-18 22:10:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `vehiculo_id` int(11) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `tipo_servicio` varchar(100) DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL,
  `fecha` date NOT NULL,
  `satisfaccion` int(11) DEFAULT NULL CHECK (`satisfaccion` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(20) DEFAULT 'pendiente',
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `vehiculo_id`, `descripcion`, `tipo_servicio`, `precio`, `fecha`, `satisfaccion`, `created_at`, `estado`, `activo`) VALUES
(9, 9, 'MANTENIMIENTO TREN DELANTERO', 'MANTENIMIENTO', 300000.00, '2026-12-02', NULL, '2026-02-18 22:04:41', 'listo', 1),
(10, 10, 'mantenimiento general', 'MANTENIMIENTO', 500000.00, '2026-02-18', 4, '2026-02-18 22:08:50', 'entregado', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_usuarios`
--

CREATE TABLE `solicitudes_usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_usuarios`
--

INSERT INTO `solicitudes_usuarios` (`id`, `nombre`, `email`, `password`, `estado`, `created_at`) VALUES
(1, 'sebastian', 'sebasocampo721@gmail.com', '$2b$10$n4Ki3vQVJLRsKz1pjzXPuOV3719WoMSu2W7BS304B21YhNovboc82', 'aprobado', '2026-02-19 15:09:39'),
(2, 'sebastian', 'sebasocampo721@gmail.com', '$2b$10$YCX4Wf/iu97WWI7X1bTP.eH/yst/toxZCyC5Q76NDoaZWAjHJm1v.', 'pendiente', '2026-02-19 15:38:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `created_at`, `reset_token`, `reset_expires`) VALUES
(1, 'Administrador', 'admin@autopremium.com', '$2b$10$wLsGq5FexHG4upnph0Wq.e.O2d9Z2LGWiw6HGguTNlv9OTAL3uagm', 'admin', '2026-02-18 20:12:34', NULL, NULL),
(2, 'sebastian', 'sebasocampo721@gmail.com', '$2b$10$n4Ki3vQVJLRsKz1pjzXPuOV3719WoMSu2W7BS304B21YhNovboc82', 'admin', '2026-02-19 20:42:53', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `placa` varchar(10) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `anio` int(11) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id`, `cliente_id`, `placa`, `marca`, `modelo`, `anio`, `color`, `created_at`, `activo`) VALUES
(9, 4, 'GTT388', 'MAZDA', '2021', 2021, 'BLANCO', '2026-02-18 21:54:40', 1),
(10, 6, 'nxk511', 'nissan', '2025', 2025, 'gris', '2026-02-18 22:08:19', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehiculo_id` (`vehiculo_id`);

--
-- Indices de la tabla `solicitudes_usuarios`
--
ALTER TABLE `solicitudes_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `placa` (`placa`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `solicitudes_usuarios`
--
ALTER TABLE `solicitudes_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD CONSTRAINT `encuestas_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`);

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
