import { NextRequest, NextResponse } from "next/server";
import { migrateUsersToUID, checkDuplicateUsers } from "@/scripts/migrate-users";

export async function POST(request: NextRequest) {
  try {
    // 개발 환경에서만 실행 가능하도록 제한
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "마이그레이션은 개발 환경에서만 실행 가능합니다." },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    if (action === "migrate") {
      await migrateUsersToUID();
      return NextResponse.json({ 
        success: true, 
        message: "사용자 데이터 마이그레이션이 완료되었습니다." 
      });
    } else if (action === "check") {
      await checkDuplicateUsers();
      return NextResponse.json({ 
        success: true, 
        message: "중복 사용자 확인이 완료되었습니다. 콘솔을 확인하세요." 
      });
    } else {
      return NextResponse.json(
        { error: "올바르지 않은 액션입니다. 'migrate' 또는 'check'를 사용하세요." },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("마이그레이션 API 오류:", error);
    return NextResponse.json(
      { error: "마이그레이션 중 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "사용자 마이그레이션 API",
    usage: {
      migrate: "POST /api/migrate-users { \"action\": \"migrate\" }",
      check: "POST /api/migrate-users { \"action\": \"check\" }"
    }
  });
} 