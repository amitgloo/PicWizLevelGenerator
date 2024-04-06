import openai
from settings import API_KEY, CHAT_THEME

openai.api_key = API_KEY

def get_chat_gpt_response(messages):
    if len(messages) <= 1:
        messages.insert(0, CHAT_THEME)

    chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
    reply = chat.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return messages


def main():
    messages = [CHAT_THEME]

    while True:
        message = input("User: ")
        if message:
            messages.append(
                {"role": "user", "content": message},
            )
            chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
        
        reply = chat.choices[0].message.content
        print(f"ChatGPT: {reply}")
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()