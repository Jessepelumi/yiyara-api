def get_chat_history(conversation, limit=10):
    messages = conversation.messages.all()[:limit]
    return [
        {"role": m.role, "content": m.content} 
        for m in messages
    ]
