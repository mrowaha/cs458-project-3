import time
import unittest
from typing import Literal
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions


Models = Literal["chatgpt"] | Literal["claude"] | Literal["copilot"] | Literal["bard"]


class AiSurveyTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up WebDriver and get google login credentials from arguments"""
        pass

    @property
    def email_input_field(self: "AiSurveyTest"):
        email_input_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__field:email"))
        )
        return email_input_field

    @property
    def password_input_field(self: "AiSurveyTest"):
        password_input_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "login-form__field:password"))
        )
        return password_input_field

    @property
    def sign_in_button(self: "AiSurveyTest"):
        sign_in_button = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "login-form__action:submit"))
        )
        return sign_in_button

    @property
    def submit_form_button(self: "AiSurveyTest"):
        submit_form_button = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "aisurvey-form__action:submit"))
        )
        return submit_form_button

    @property
    def reset_form_button(self: "AiSurveyTest"):
        reset_form_button = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "aisurvey-form__action:reset"))
        )
        return reset_form_button

    @property
    def fullname_input(self: "AiSurveyTest"):
        fullname_input = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "ai-survey__field:full-name"))
        )
        return fullname_input

    @property
    def birthdate_input(self: "AiSurveyTest"):
        birthdate_input = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "ai-survey__field:birthdate"))
        )
        return birthdate_input

    def get_model_checkbox(self: "AiSurveyTest", model: Models):
        model_checkbox = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, f"ai-survey__field:model-{model}"))
        )
        return model_checkbox

    def get_modeldefect_input(self: "AiSurveyTest", model: Models):
        modeldefect_input = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, f"ai-survey__field:modeldefect-{model}"))
        )
        return modeldefect_input

    def setUp(self):
        """Set up a new WebDriver for each test with Chrome or Firefox"""
        options = ChromeOptions()
        service = ChromeService()
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.get("http://localhost:5173")

    def tearDown(self):
        """Close WebDriver after each test"""
        self.driver.quit()

    def login(self):
        self.email_input_field.send_keys("john.doe@example.com")
        self.password_input_field.send_keys("P@ssw0rd123")
        self.sign_in_button.click()

        ai_survey_link = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "dashboard__action:to-ai-survey"))
        )

        ai_survey_link.click()

    def scroll_element_into_view(self, element_id: str):
        container = self.driver.find_element(By.ID, "ai-survey__form")
        target = self.driver.find_element(By.ID, element_id)

        self.driver.execute_script(
            "arguments[0].scrollTop = arguments[1].offsetTop - arguments[0].offsetTop;",
            container, target
        )

    def test_required_fields(self: "AiSurveyTest"):
        self.login()
        self.submit_form_button.click()
        fullname_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "ai-survey__error:full-name"))
        )
        self.assertIsNotNone(
            fullname_error_toast, "Full Name Error Toast should be visible")

        expected_message = "Name is required"
        actual_message = fullname_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

        birthdate_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "ai-survey__error:birthdate"))
        )

        self.assertIsNotNone(
            birthdate_error_toast, "Birth Date Error Toast should be visible")

        expected_message = "Birth Date is required"
        actual_message = birthdate_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

    def test_format_validation(self: "AiSurveyTest"):
        self.login()
        self.fullname_input.send_keys('123@!')
        self.birthdate_input.send_keys('123@!')
        self.submit_form_button.click()
        fullname_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "ai-survey__error:full-name"))
        )
        self.assertIsNotNone(
            fullname_error_toast, "Full Name Error Toast should be visible")

        expected_message = "Name contains invalid characters"
        actual_message = fullname_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

        birthdate_error_toast = WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located(
                (By.ID, "ai-survey__error:birthdate"))
        )

        self.assertIsNotNone(
            birthdate_error_toast, "Birth Date Error Toast should be visible")

        expected_message = "Birth Date is invalid"
        actual_message = birthdate_error_toast.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")

    def test_dynamic_modeldefects(self: "AiSurveyTest"):
        self.login()

        # ChatGPT
        self.scroll_element_into_view("ai-survey__field:model-chatgpt")
        chatgpt_checkbox = self.get_model_checkbox("chatgpt")

        with self.assertRaises(NoSuchElementException):
            self.driver.find_element(
                By.ID, "ai-survey__field:modeldefect-chatgpt")

        chatgpt_checkbox.click()

        self.scroll_element_into_view("ai-survey__field:modeldefect-chatgpt")
        chatgpt_defectfield = self.get_modeldefect_input("chatgpt")
        self.assertIsNotNone(chatgpt_defectfield)

        # Claude
        self.scroll_element_into_view("ai-survey__field:model-claude")
        claude_checkbox = self.get_model_checkbox("claude")

        with self.assertRaises(NoSuchElementException):
            self.driver.find_element(
                By.ID, "ai-survey__field:modeldefect-claude")

        claude_checkbox.click()

        self.scroll_element_into_view("ai-survey__field:modeldefect-claude")
        claude_defectfield = self.get_modeldefect_input("claude")
        self.assertIsNotNone(claude_defectfield)

    def test_form_reset(self):
        self.login()
        driver = self.driver
        name_input = self.fullname_input
        name_input.send_keys("cs project")

        self.scroll_element_into_view("ai-survey__field:model-chatgpt")
        gpt_checkbox = driver.find_element(
            By.ID, "ai-survey__field:model-chatgpt")
        gpt_checkbox.click()

        # Wait for defect field to appear
        self.scroll_element_into_view("ai-survey__field:modeldefect-chatgpt")
        gpt_defect_input = self.get_modeldefect_input("chatgpt")
        gpt_defect_input.send_keys("defect")

        # Click reset
        self.scroll_element_into_view("aisurvey-form__action:reset")
        reset_btn = self.reset_form_button
        reset_btn.click()
        # Assertions
        self.assertEqual(name_input.get_attribute("value"), "")

        # Model defect input should be removed
        with self.assertRaises(NoSuchElementException):
            driver.find_element(By.ID, "ai-survey__field:modeldefect-chatgpt")

    def test_maximum_input(self: "AiSurveyTest"):
        self.login()
        self.fullname_input.send_keys("rowaha")
        self.birthdate_input.send_keys("29-10-2001")

        self.scroll_element_into_view("ai-survey__field:model-chatgpt")
        chatgpt_checkbox = self.get_model_checkbox("chatgpt")
        chatgpt_checkbox.click()
        self.scroll_element_into_view("ai-survey__field:modeldefect-chatgpt")
        chatgpt_defectfield = self.get_modeldefect_input("chatgpt")
        chatgpt_defectfield.send_keys(
            "This will be increase character length of 10")

        self.submit_form_button.click()
        self.scroll_element_into_view("ai-survey__error:modeldefect-chatgpt")
        chatgpt_defecterror = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.ID, "ai-survey__error:modeldefect-chatgpt"))
        )
        expected_message = "Defect/con cannot exceed 10 characters"
        actual_message = chatgpt_defecterror.text.strip()
        self.assertEqual(actual_message, expected_message,
                         f"Expected toast message '{expected_message}', got '{actual_message}'")


if __name__ == '__main__':
    unittest.main()
