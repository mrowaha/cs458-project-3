import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions


class LoginTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up WebDriver and get google login credentials from arguments"""
        pass

    @property
    def email_input_field(self: "LoginTest"):
        email_input_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__field:email"))
        )
        return email_input_field

    @property
    def password_input_field(self: "LoginTest"):
        password_input_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__field:password"))
        )
        return password_input_field

    @property
    def sign_in_button(self: "LoginTest"):
        sign_in_button = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "login-form__action:submit"))
        )
        return sign_in_button

    def setUp(self):
        """Set up a new WebDriver for each test with Chrome or Firefox"""
        options = ChromeOptions()
        service = ChromeService()
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.get("http://localhost:5173")

    def tearDown(self):
        """Close WebDriver after each test"""
        self.driver.quit()

    def test_incomplete_fields(self: "LoginTest"):
        self.sign_in_button.click()
        email_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__error:email"))
        )
        self.assertIsNotNone(
            email_error_toast, "Email Error Toast should be visible")

        password_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__error:password"))
        )
        self.assertIsNotNone(password_error_toast,
                             "Password Erorr Toast should be visible")

    def test_invalid_email_format(self: "LoginTest"):
        self.email_input_field.send_keys("not-an-email")
        self.sign_in_button.click()
        email_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__error:email"))
        )
        self.assertIsNotNone(
            email_error_toast, "Email Error Toast should be visible")

        expected_message = "Invalid email address"
        actual_message = email_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

    def test_unauthorized_login(self: "LoginTest"):
        self.email_input_field.send_keys("john.doe@example.com")
        self.password_input_field.send_keys("b")
        self.sign_in_button.click()
        unauth_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__error:unauthorized"))
        )
        self.assertIsNotNone(unauth_error_toast,
                             "Unauthorized should be visible")

        expected_message = "Incorrect password. Please try again."
        actual_message = unauth_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

    def test_no_such_user(self: "LoginTest"):
        self.email_input_field.send_keys("a@b.com")
        self.password_input_field.send_keys("b")
        self.sign_in_button.click()
        unauth_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__error:unauthorized"))
        )
        self.assertIsNotNone(unauth_error_toast,
                             "Unauthorized should be visible")

        expected_message = "No such user found with that email."
        actual_message = unauth_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

    def test_successful_login(self: "LoginTest"):
        self.email_input_field.send_keys("john.doe@example.com")
        self.password_input_field.send_keys("P@ssw0rd123")
        self.sign_in_button.click()

        expected_url = "http://localhost:5173/dashboard"
        WebDriverWait(self.driver, 10).until(
            lambda d: d.current_url == expected_url)
        self.assertEqual(self.driver.current_url, expected_url,
                         "Expected Url after successful login should be /dashboard")

    def test_access_denied(self: "LoginTest"):
        self.driver.get("http://localhost:5173/dashboard")
        expected_url = "http://localhost:5173/"
        WebDriverWait(self.driver, 5).until(
            lambda d: d.current_url == expected_url)
        self.assertEqual(self.driver.current_url, expected_url,
                         "User should be not authorized and redirected to login")


if __name__ == '__main__':
    unittest.main()
