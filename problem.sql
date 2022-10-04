-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.24-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table smartsys_ticketing.problem: ~60 rows (approximately)
INSERT IGNORE INTO `problem` (`idproblem`, `namaproblem`, `idsql`, `kategori`) VALUES
	(1, 'Stock Waiting', 'material-stock_waiting', 'Material'),
	(2, 'Partial', 'material-partial', 'Material'),
	(3, 'Sortir', 'material-sortir', 'Material'),
	(4, 'Inner Part Kosong', 'material-innerpart_kosong', 'Material'),
	(5, 'Repair Part', 'material-repair_part', 'Material'),
	(6, 'Trimming Part', 'material-trimming', 'Material'),
	(8, 'Stock Opname', 'material-stock_opname', 'Material'),
	(9, 'Lain Lain Material', 'material-others', 'Material'),
	(10, 'Setting Program', 'proses-set_program', 'Proses'),
	(11, 'Ganti Tool', 'proses-ganti_tool', 'Proses'),
	(12, 'Trial Non Machining', 'proses-trial_non_machining', 'Proses'),
	(13, 'Trial Machining', 'proses-trial_machining', 'Proses'),
	(14, 'Q - Time', 'proses-q_time', 'Proses'),
	(15, 'Jig & Fixture', 'proses-jig_fixture', 'Proses'),
	(16, 'Waiting CMM', 'proses-waiting_cmm', 'Proses'),
	(17, 'Ukur Manual', 'proses-ukur_manual', 'Proses'),
	(18, 'Leaktest Part Imparge', 'proses-lt_part_imprag', 'Proses'),
	(19, 'Ganti Treebond', 'proses-ganti_treebond', 'Proses'),
	(20, 'Perubahan Proses', 'proses-perubahan_proses', 'Proses'),
	(21, 'Job Set Up', 'proses-job_setup', 'Proses'),
	(22, 'Lain Lain Proses', 'proses-others', 'Proses'),
	(23, 'M/C Trouble', 'mach-mc_trouble', 'Mesin'),
	(24, 'M/C Assy', 'mach-mc_assy_trouble', 'Mesin'),
	(25, 'M/C SPM Drill', 'mach-mc_spm_drill', 'Mesin'),
	(26, 'Washing Trouble', 'mach-washing_trouble', 'Mesin'),
	(27, 'Leaktest Trouble', 'mach-mc_lt_trouble', 'Mesin'),
	(28, 'Warming Up', 'mach-warming_up', 'Mesin'),
	(29, 'Angin Drop', 'mach-angin_drop', 'Mesin'),
	(30, 'Penambahan Coolant', 'mach-penambahan_coolant', 'Mesin'),
	(31, 'Lain Lain Mesin', 'mach-others', 'Mesin'),
	(32, 'Gagal Vacum', 'auto-gagal_vacum', 'Automation'),
	(33, 'Gagal Ambil', 'auto-gagal_ambil', 'Automation'),
	(34, 'Instocker Trouble', 'auto-instocker_trouble', 'Automation'),
	(35, 'Outstocker Trouble', 'auto-outstocker_trouble', 'Automation'),
	(36, 'Feeder Trouble', 'auto-feeder_trouble', 'Automation'),
	(37, 'Flipper Trouble', 'auto-flipper_trouble', 'Automation'),
	(38, 'Robot Trouble', 'auto-robot_trouble', 'Automation'),
	(39, 'Persiapan Produksi', 'others-persiapan_produksi', 'Others'),
	(40, 'Listrik Mati', 'others-listrik_mati', 'Others'),
	(41, 'Kuras Washing', 'others-kuras_washing', 'Others'),
	(42, 'P5M', 'others-p5m', 'Others'),
	(43, 'M/P Sakit', 'others-mp_sakit', 'Others'),
	(44, 'Lain Lain Others', 'others-others', 'Others'),
	(45, '5R', 'terplanning-5r', 'Terplanning'),
	(46, 'MP Pengganti', 'terplanning-mp_pengganti', 'Terplanning'),
	(47, 'CT Tidak Standart', 'terplanning-ct_tidak_standart', 'Terplanning'),
	(48, 'MP Dialihkan', 'terplanning-mp_dialihkan', 'Terplanning'),
	(49, 'Dandori', 'terplanning-dandori', 'Terplanning'),
	(50, 'Preventive Maintenance', 'terplanning-preventive_mt', 'Terplanning'),
	(51, 'Produksi Part Lain', 'terplanning-prod_part_lain', 'Terplanning'),
	(52, 'Produksi 2/3 Jig', 'terplanning-prod_2/3_jig', 'Terplanning'),
	(53, 'Produksi 1 MP', 'terplanning-prod_1_mp', 'Terplanning'),
	(54, 'Produksi 2 MC', 'terplanning-prod_2_mc', 'Terplanning'),
	(55, 'Overlap Line Lain', 'terplanning-overlap_line_lain', 'Terplanning'),
	(56, 'Layoff MP', 'terplanning-layoff_mp', 'Terplanning'),
	(57, 'Layoff Stock Waiting', 'terplanning-layoff_stock_waiting', 'Terplanning'),
	(58, 'Layoff Tool Kosong', 'terplanning-layoff_tool_kosong', 'Terplanning'),
	(59, 'Layoff Komp. SPM', 'terplanning-layoff_komp_spm', 'Terplanning'),
	(60, 'Layoff Komp. CNC', 'terplanning-layoff_komp_cnc', 'Terplanning'),
	(61, 'Packaging Kosong', 'terplanning-packaging_kosong', 'Terplanning');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
