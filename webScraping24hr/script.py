from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
import csv

def search_product(driver, product_name):
    search_box = driver.find_element(By.ID, "searchInput")
    search_box.clear()
    search_box.send_keys(product_name)
    search_box.send_keys(Keys.RETURN)
    time.sleep(2)  # Wait for results to load

def get_product_links(driver):
    return driver.find_elements(By.CSS_SELECTOR, "a[href='https://www.camplify.co.uk/rv/campervan-rental-hitchin-herts-phoenix/124281']")


def scrape_product_details(driver, link):
    link.click()
    # Wait for the product page to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "card124281")))
    
    name = driver.find_element(By.CLASS_NAME, "Text sc-hNDKOd hCAIir Text--size1 Text--weight-bold").text
    price = driver.find_element(By.CLASS_NAME, "Text sc-ftxyaM cjkCJD Text--size1 Text--weight-bold").text
    
    driver.back()
    return {"name": name, "price": price}

def main():
   
   # Specify the path to ChromeDriver
    s = Service('/Users/tainejarvis/Downloads/chromedriver-mac-x64/chromedriver')

# Pass the service object to the driver
    driver = webdriver.Chrome(service=s)
    driver.get("https://www.camplify.co.uk/s/london?seed=92361&page=9")  

    products = ["Butch Cherokee J", "Peter W VW Trans", "Gino Di Camper"]  
    results = []

    start_time = time.time()
    duration = 24 * 60 * 60  # 24 hours in seconds

    while time.time() - start_time < duration:
        for product in products:
            try:
                search_product(driver, product)
                links = get_product_links(driver)
                
                for link in links:
                    details = scrape_product_details(driver, link)
                    results.append(details)
                
                # Save results periodically
                with open('results.csv', 'w', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=["name", "price"])
                    writer.writeheader()
                    writer.writerows(results)
                
                time.sleep(5)  # Delay between searches to avoid overloading the server
            
            except Exception as e:
                print(f"Error scraping {product}: {str(e)}")
                continue

    driver.quit()

if __name__ == "__main__":
    main()