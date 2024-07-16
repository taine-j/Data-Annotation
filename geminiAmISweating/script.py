import requests

def analyze_image(image_path):
    # Replace with your actual Gemini Pro API endpoint and API key
    api_endpoint = "https://api.geminipro.com/analyze"
    api_key = "AIzaSyAHxre9mqQLmbSiipCP6StjUvsDg1WZ8pY"

    # Open the image file in binary mode
    with open(image_path, 'rb') as image_file:
        # Prepare the files and headers for the request
        files = {'image': image_file}
        headers = {'Authorization': f'Bearer {api_key}'}

        # Send the POST request to the Gemini Pro API
        response = requests.post(api_endpoint, files=files, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        result = response.json()

        # Assuming the response JSON contains a field 'is_sweating'
        is_sweating = result.get('is_sweating', False)
        return is_sweating
    else:
        # Handle any errors (for example, print the error message)
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Example usage
image_path = "./man.jpg"  # Replace with the actual image path
is_sweating = analyze_image(image_path)

if is_sweating is not None:
    if is_sweating:
        print("The person in the image is sweating.")
    else:
        print("The person in the image is not sweating.")