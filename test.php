<?php
// Simple test to verify PHP server is working
echo "<!DOCTYPE html>";
echo "<html><head><title>PHP Test</title></head><body>";
echo "<h1>PHP Server is Working!</h1>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<a href='index.html'>Go to PharmaCare Homepage</a>";
echo "</body></html>";
?>