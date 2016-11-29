<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @package    Everlightbox
 * @subpackage Everlightbox/includes
 * @author     GreenTreeLabs <diego@greentreelabs.net>
 * @since    1.1.12
 */
class EverlightBox_AdminTab {
	protected $tabs;

	public function __construct() {
		$this->tabs = array();
	}

	public function add($code, $title) {
		$this->tabs[$code] = $title;
	}

	public function get_tabs() {
		return $this->tabs;
	}
}