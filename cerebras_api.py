from cerebras.cloud.sdk import Cerebras

api_key = 'csk-9h6k63fcct83wvjcjenteyec4c56jvxe9npnyjhv9ypdvkkp'

def generate_response():
    try:
        if not api_key:
            raise ValueError("CEREBRAS_API_KEY is not set.")

        client = Cerebras(api_key=api_key)

        stream = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""say helllllooooo"""
            }
        ],
        model="llama-4-scout-17b-16e-instruct",
        stream=True,
    )

    # Just the assistant's answer
        full_response = ""
        for chunk in stream:
            content = chunk.choices[0].delta.content or ""
            full_response += content
        print(full_response)    
        return full_response

    except ValueError as ve:
        print(f"[Environment Error] {ve}")

    except Exception as e:
        print(f"[Unexpected Error] {e}")

generate_response()
