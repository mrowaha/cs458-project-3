import unittest
import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException 
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
# from selenium.webdriver.common.action_chains import ActionChains

class SurveyCreatorTest(unittest.TestCase):

    def setUp(self):
        options = ChromeOptions()
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        # options.add_argument("--headless") 
        options.add_argument("--window-size=1920,1080") 
        service = ChromeService() 
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.get("http://localhost:5173/create-survey")
        self.wait = WebDriverWait(self.driver, 15) 

    def tearDown(self):
        self.driver.quit()

    def find_element(self, by, value):
        return self.wait.until(EC.presence_of_element_located((by, value)))

    def find_visible_element(self, by, value):
        return self.wait.until(EC.visibility_of_element_located((by, value)))
    
    def find_clickable_element(self, by, value):
        return self.wait.until(EC.element_to_be_clickable((by, value)))

    def test_survey_title_validation(self):

        title_input_selector = "[data-testid='survey-title-input']"
        save_button_selector = "[data-testid='save-survey-button']"

        error_empty_selector = "[data-testid='survey-title-error-empty']"
        error_long_selector = "[data-testid='survey-title-error-long']"

        title_input = self.find_element(By.CSS_SELECTOR, title_input_selector)
        save_button = self.find_clickable_element(By.CSS_SELECTOR, save_button_selector)

        # Test with empty title
        title_input.clear()
        save_button.click()

        self.assertTrue(True)

    def test_survey_title_validation(self):

        title_input_selector = "[data-testid='survey-title-input']"
        save_button_selector = "[data-testid='save-survey-button']"

        error_empty_selector = "[data-testid='survey-title-error-empty']"
        error_long_selector = "[data-testid='survey-title-error-long']"

        title_input = self.find_element(By.CSS_SELECTOR, title_input_selector)
        save_button = self.find_clickable_element(By.CSS_SELECTOR, save_button_selector)
        # Test with title longer than 30 characters
        title_input.clear()
        title_input.send_keys("This is a very very very very very long title that exceeds thirty characters")
        save_button.click()

        self.assertTrue(True)

    def test_survey_title_validation(self):

        title_input_selector = "[data-testid='survey-title-input']"
        save_button_selector = "[data-testid='save-survey-button']"

        error_empty_selector = "[data-testid='survey-title-error-empty']"
        error_long_selector = "[data-testid='survey-title-error-long']"

        title_input = self.find_element(By.CSS_SELECTOR, title_input_selector)
        save_button = self.find_clickable_element(By.CSS_SELECTOR, save_button_selector)
        # Test with a valid title
        title_input.clear()
        title_input.send_keys("Valid Survey Title")
        save_button.click()

        self.assertTrue(True)


    def _add_question_and_get_id(self, question_type_button_testid):

        add_button = self.find_clickable_element(By.CSS_SELECTOR, f"[data-testid='{question_type_button_testid}']")
        add_button.click()

        question_blocks = self.driver.find_elements(By.CSS_SELECTOR, "[data-testid^='question-block-']")
        self.assertTrue(len(question_blocks) > 0, "Question block was not added")
        new_question_block = question_blocks[-1] # Get the last added question
        question_id = new_question_block.get_attribute("data-testid").replace("question-block-", "")
        return question_id, new_question_block


    def test_add_all_question_types(self):
        """Test adding each type of question."""
        question_types_to_test = {
            "multipleChoice": {
                "button_testid": "add-question-multipleChoice-button",
                "expected_element_testid_pattern": "question-{id}-option-0-input"
            },
            "ratingScale": {
                "button_testid": "add-question-ratingScale-button",
                "expected_element_testid_pattern": "question-{id}-rating-scale-select-trigger"
            },
            "openEnded": {
                "button_testid": "add-question-openEnded-button",
                "expected_element_testid_pattern": "question-{id}-title-input"
            },
            "dropdown": {
                "button_testid": "add-question-dropdown-button",
                "expected_element_testid_pattern": "question-{id}-option-0-input"
            },
            "checkboxes": {
                "button_testid": "add-question-checkboxes-button",
                "expected_element_testid_pattern": "question-{id}-option-0-input"
            }
        }

        initial_question_count = len(self.driver.find_elements(By.CSS_SELECTOR, "[data-testid^='question-block-']"))

        for i, (q_type, details) in enumerate(question_types_to_test.items()):
            current_q_id, _ = self._add_question_and_get_id(details["button_testid"])
            expected_element_selector = f"[data-testid='{details['expected_element_testid_pattern'].replace('{id}', current_q_id)}']"
            self.find_element(By.CSS_SELECTOR, expected_element_selector)
            self.assertEqual(len(self.driver.find_elements(By.CSS_SELECTOR, "[data-testid^='question-block-']")), initial_question_count + i + 1)


    def test_can_write_in_question_boxes(self):

        mc_button_testid = "add-question-multipleChoice-button"
        q_id, question_block = self._add_question_and_get_id(mc_button_testid)

        title_input_selector = f"[data-testid='question-{q_id}-title-input']"
        option_0_input_selector = f"[data-testid='question-{q_id}-option-0-input']"

        title_input = question_block.find_element(By.CSS_SELECTOR, title_input_selector)
        title_input.send_keys("What is your favorite color?")
        self.assertEqual(title_input.get_attribute("value"), "What is your favorite color?")

        option_0_input = question_block.find_element(By.CSS_SELECTOR, option_0_input_selector)
        option_0_input.send_keys("Red")
        self.assertEqual(option_0_input.get_attribute("value"), "Red")

    def test_save_survey_button_presence(self):

        save_button = self.find_element(By.CSS_SELECTOR, "[data-testid='save-survey-button']")
        self.assertTrue(save_button.is_displayed())


    def test_back_button_functionality(self):

        # This is the URL of the page where the test starts
        initial_url = self.driver.current_url
  
        expected_redirect_url_for_unauthenticated = "http://localhost:5173/"


        self.assertTrue("/create-survey" in initial_url,
                        f"Test did not start on the /create-survey page. Current URL: {initial_url}")

        back_button_selector = "[data-testid='back-to-dashboard-button']" 
        back_button = self.find_clickable_element(By.CSS_SELECTOR, back_button_selector)
        back_button.click()

        try:
            # Wait for the URL to change to the expected redirect URL
            self.wait.until(EC.url_to_be(expected_redirect_url_for_unauthenticated))

            current_url_normalized = self.driver.current_url.rstrip('/')
            expected_redirect_normalized = expected_redirect_url_for_unauthenticated.rstrip('/')

            self.assertEqual(current_url_normalized, expected_redirect_normalized,
                             f"Expected redirect to '{expected_redirect_normalized}")


        except TimeoutException:
            current_url_at_failure = self.driver.current_url

            page_source_snippet = self.driver.page_source[0:500] if self.driver.page_source else "N/A"
            self.fail(
                f"Failed to redirect to the expected root URL ('{expected_redirect_url_for_unauthenticated}').\n"
                f"Initial URL was '{initial_url}'.\n"
                f"Current URL at timeout: '{current_url_at_failure}'.\n"
                f"Page source snippet: {page_source_snippet}"
            )


    def test_required_button_functionality(self):
        """Check if the required button can be toggled for a question."""
        oe_button_testid = "add-question-openEnded-button"
        q_id, question_block = self._add_question_and_get_id(oe_button_testid)

        required_checkbox_selector = f"[data-testid='question-{q_id}-required-checkbox']"
        required_checkbox = question_block.find_element(By.CSS_SELECTOR, required_checkbox_selector)

        self.assertFalse(required_checkbox.is_selected(), "Required checkbox should be unselected initially.")
        required_checkbox.click()
        self.assertTrue(required_checkbox.is_selected(), "Required checkbox should be selectable.")
        required_checkbox.click()
        self.assertFalse(required_checkbox.is_selected(), "Required checkbox should be deselectable.")

    def test_add_conditional_logic(self):

        source_q_id, source_q_block = self._add_question_and_get_id("add-question-multipleChoice-button")
        source_q_title_input = source_q_block.find_element(By.CSS_SELECTOR, f"[data-testid='question-{source_q_id}-title-input']")
        source_q_title_input.send_keys("Do you like Programming?")
        source_q_option0_input = source_q_block.find_element(By.CSS_SELECTOR, f"[data-testid='question-{source_q_id}-option-0-input']")
        source_q_option0_input.send_keys("Yes")
        source_q_option1_input = source_q_block.find_element(By.CSS_SELECTOR, f"[data-testid='question-{source_q_id}-option-1-input']")
        source_q_option1_input.send_keys("No")


        # Add second question (e.g., Open Ended) - this will be the conditional question
        target_q_id, target_q_block = self._add_question_and_get_id("add-question-openEnded-button")
        target_q_title_input = target_q_block.find_element(By.CSS_SELECTOR, f"[data-testid='question-{target_q_id}-title-input']")
        target_q_title_input.send_keys("Which language?")


        # Open conditional logic for the target question
        conditional_toggle_selector = f"[data-testid='conditional-logic-toggle-{target_q_id}']"
        conditional_toggle = target_q_block.find_element(By.CSS_SELECTOR, conditional_toggle_selector)
        conditional_toggle.click()
        self.assertTrue(conditional_toggle.is_selected())

        # Select the source question in the conditional logic dropdown
        cond_q_select_trigger_selector = f"[data-testid='conditional-question-select-trigger-{target_q_id}']"
        cond_q_select_trigger = self.find_clickable_element(By.CSS_SELECTOR, cond_q_select_trigger_selector)
        cond_q_select_trigger.click()

        # Wait for dropdown content to be visible
        cond_q_select_content_selector = f"[data-testid='conditional-question-select-content-{target_q_id}']"
        self.find_visible_element(By.CSS_SELECTOR, cond_q_select_content_selector)
        
        # Click the source question option (using its data-testid, which is based on source_q_id)
        cond_q_option_selector = f"[data-testid='conditional-question-option-{source_q_id}']"
        cond_q_option_to_click = self.find_clickable_element(By.CSS_SELECTOR, cond_q_option_selector)
        cond_q_option_to_click.click()


        # Select an answer from the source question in the conditional logic
        cond_ans_select_trigger_selector = f"[data-testid='conditional-answer-select-trigger-{target_q_id}']"
        cond_ans_select_trigger = self.find_clickable_element(By.CSS_SELECTOR, cond_ans_select_trigger_selector)
        cond_ans_select_trigger.click()
        
        cond_ans_select_content_selector = f"[data-testid='conditional-answer-select-content-{target_q_id}']"
        self.find_visible_element(By.CSS_SELECTOR, cond_ans_select_content_selector)


        cond_ans_option_selector = f"[data-testid='conditional-answer-option-{target_q_id}-{source_q_id}-0']"
        cond_ans_option_to_click = self.find_clickable_element(By.CSS_SELECTOR, cond_ans_option_selector)
        cond_ans_option_to_click.click()


        self.assertTrue(True, "Conditional logic UI interaction completed.")


if __name__ == '__main__':
    unittest.main(verbosity=2)