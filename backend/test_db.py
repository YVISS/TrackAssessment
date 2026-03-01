import asyncio
from database import engine
from sqlalchemy import text

async def test():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        print("DB test result:", result.scalar())

asyncio.run(test())
