import requests
import random
import string
import json
import time
import os
import glob
import mimetypes
from pathlib import Path

# ========== CẤU HÌNH ==========
URL = "http://localhost:8888/api/v1/post/create"
AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJRdW9ra2EuY29tIiwic3ViIjoiY2MzYjE5NmQtNGUwMC00ZTA4LThjODItM2MyNWQzY2ViMTQzIiwiZXhwIjoxNzU4NTkwNzkwLCJpYXQiOjE3NTg1ODg5OTAsImp0aSI6IjJjMTI1MDNjLTVhMjAtNDZiMy04Y2VlLTY0YTg3MzVkMWM5MSIsInNjb3BlIjoiUk9MRV9QVUJMSVNIRVIifQ.xIZfCCYTo-a_M_5DrmpGEQz5bXpMoIWvDFiL_whU_kCBz3muiN6-P9NFgY3SyxwsarBPkYbXpNyuLcG2wJppmA"
IMAGE_FOLDER = r"C:\Users\ACER\Pictures\image"  
DRY_RUN = False  # True để chỉ in payload, không gửi request
# ==============================

HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}


category_data = {
    "68c1952e01a6496adab2f9aa": {  # Công nghệ
        "tags": ["AI", "công nghệ", "blockchain", "lập trình", "robot", "IoT", "5G", "machine learning"],
        "titles": [
            "Cuộc cách mạng AI đang thay đổi thế giới như thế nào?",
            "Blockchain - Công nghệ định hình tương lai tài chính",
            "5G và IoT: Kết nối vạn vật thông minh",
            "Machine Learning trong đời sống hàng ngày",
            "Xu hướng lập trình 2024: Ngôn ngữ nào đang lên ngôi?"
        ],
        "content_templates": [
            "Công nghệ đang bùng nổ và thay đổi cách chúng ta làm việc, học tập và giải trí...",
            "AI và IoT đang mở ra thời kỳ mới của nền kinh tế số.",
            "Blockchain mang đến cơ hội minh bạch và an toàn hơn cho giao dịch tài chính."
        ]
    },
    "68c1956201a6496adab2f9ab": {  # Thể thao
        "tags": ["bóng đá", "tennis", "bơi lội", "chạy bộ", "gym", "yoga", "marathon", "thể hình"],
        "titles": [
            "Bí quyết tập luyện hiệu quả cho người mới bắt đầu",
            "Marathon Việt Nam: Sức hút của môn chạy bộ đường dài",
            "Xu hướng thể thao mới được giới trẻ yêu thích"
        ],
        "content_templates": [
            "Thể thao giúp cải thiện sức khỏe và tinh thần.",
            "Chạy bộ đang trở thành xu hướng phổ biến trong cộng đồng.",
            "Yoga và gym ngày càng được ưa chuộng tại Việt Nam."
        ]
    },
    "68c1956e01a6496adab2f9ac": {  # Kinh doanh
        "tags": ["chứng khoán", "đầu tư", "doanh nghiệp", "kinh tế", "startup", "marketing", "bất động sản", "crypto"],
        "titles": [
            "Thị trường chứng khoán Việt Nam: Cơ hội và thách thức",
            "Xu hướng đầu tư bất động sản 2024",
            "Startup Việt Nam - Từ ý tưởng đến thành công"
        ],
        "content_templates": [
            "Kinh tế Việt Nam đang phục hồi mạnh mẽ.",
            "Startup Việt Nam ngày càng nhận được nhiều vốn đầu tư.",
            "Marketing số trở thành chìa khóa thành công trong kinh doanh hiện đại."
        ]
    },
    "68c1957701a6496adab2f9ad": {  # Sức khỏe
        "tags": ["sức khỏe", "dinh dưỡng", "tập luyện", "y tế", "mental health", "detox", "vitamin", "thuốc thảo dược"],
        "titles": [
            "Chế độ dinh dưỡng cân bằng cho cuộc sống khỏe mạnh",
            "10 thói quen tốt giúp tăng cường miễn dịch",
            "Tầm quan trọng của sức khỏe tâm lý trong xã hội hiện đại"
        ],
        "content_templates": [
            "Sức khỏe là tài sản quý giá nhất của con người.",
            "Chăm sóc sức khỏe tâm lý ngày càng quan trọng.",
            "Detox cơ thể là một trong những xu hướng phổ biến hiện nay."
        ]
    },
    "68c1958001a6496adab2f9ae": {  # Giải trí
        "tags": ["phim", "âm nhạc", "giải trí", "showbiz", "K-pop", "Hollywood", "phim Việt", "concert"],
        "titles": [
            "Làn sóng K-pop và ảnh hưởng đến văn hóa giới trẻ Việt",
            "Điện ảnh Việt Nam: Những bước tiến đáng ghi nhận",
            "Xu hướng âm nhạc 2024"
        ],
        "content_templates": [
            "Ngành giải trí đang thay đổi mạnh mẽ nhờ công nghệ.",
            "K-pop đã trở thành hiện tượng toàn cầu.",
            "Điện ảnh Việt Nam dần khẳng định vị thế với nhiều tác phẩm chất lượng."
        ]
    },
    "68c1958801a6496adab2f9af": {  # Giáo dục
        "tags": ["giáo dục", "học tập", "kỹ năng mềm", "du học", "e-learning", "STEM"],
        "titles": [
            "Giáo dục 4.0: Công nghệ thay đổi cách chúng ta học tập",
            "Du học trực tuyến – Xu hướng mới sau đại dịch",
            "Kỹ năng mềm quan trọng nhất cho sinh viên thế kỷ 21"
        ],
        "content_templates": [
            "Giáo dục đang chuyển mình mạnh mẽ nhờ công nghệ.",
            "STEM đóng vai trò quan trọng trong việc đào tạo thế hệ mới.",
            "E-learning giúp việc học tập linh hoạt hơn."
        ]
    },
    "68c1959001a6496adab2f9b0": {  # Khoa học
        "tags": ["khoa học", "khám phá", "nghiên cứu", "khí tượng", "thiên văn", "hóa học"],
        "titles": [
            "Khám phá mới trong ngành thiên văn học",
            "Tiến bộ khoa học Việt Nam trên bản đồ thế giới",
            "Nghiên cứu vật liệu mới cho công nghệ tương lai"
        ],
        "content_templates": [
            "Khoa học là động lực chính cho sự phát triển của nhân loại.",
            "Các phát minh khoa học giúp cải thiện cuộc sống con người.",
            "Việt Nam đang tham gia tích cực vào nghiên cứu khoa học toàn cầu."
        ]
    },
    "68c1959a01a6496adab2f9b1": {  # Du lịch
        "tags": ["du lịch", "khám phá", "ẩm thực", "phượt", "homestay", "resort"],
        "titles": [
            "Top điểm đến du lịch Việt Nam không thể bỏ lỡ",
            "Du lịch xanh – Xu hướng bền vững",
            "Trải nghiệm ẩm thực đường phố Việt Nam"
        ],
        "content_templates": [
            "Du lịch Việt Nam đang phát triển mạnh mẽ.",
            "Nhiều bạn trẻ lựa chọn phượt và camping để khám phá.",
            "Ẩm thực là một phần quan trọng của du lịch trải nghiệm."
        ]
    },
    "68c195a201a6496adab2f9b2": {  # Phong cách sống
        "tags": ["lifestyle", "thời trang", "ẩm thực", "cà phê", "minimalism"],
        "titles": [
            "Phong cách sống tối giản – Xu hướng mới",
            "Gen Z và lối sống xanh",
            "Xu hướng cà phê specialty tại Việt Nam"
        ],
        "content_templates": [
            "Phong cách sống thay đổi theo từng thế hệ.",
            "Minimalism giúp con người sống chậm lại và tận hưởng nhiều hơn.",
            "Gen Z quan tâm nhiều đến sống xanh và bền vững."
        ]
    },
    "68c195b401a6496adab2f9b3": {  # Môi trường
        "tags": ["môi trường", "biến đổi khí hậu", "tái chế", "năng lượng sạch", "rác thải nhựa"],
        "titles": [
            "Biến đổi khí hậu và tác động đến Việt Nam",
            "Năng lượng sạch – Giải pháp cho tương lai",
            "Xu hướng tái chế rác thải tại các thành phố lớn"
        ],
        "content_templates": [
            "Môi trường là vấn đề nóng toàn cầu.",
            "Biến đổi khí hậu đang tác động mạnh đến đời sống con người.",
            "Việc tái chế rác thải trở thành xu hướng tất yếu."
        ]
    },
    "68c195bd01a6496adab2f9b4": {  # Thế giới
        "tags": ["thế giới", "quốc tế", "xung đột", "hòa bình", "kinh tế toàn cầu"],
        "titles": [
            "Những sự kiện quốc tế nổi bật năm 2024",
            "Kinh tế toàn cầu và tác động đến Việt Nam",
            "Xung đột và nỗ lực vì hòa bình"
        ],
        "content_templates": [
            "Tình hình thế giới luôn biến động không ngừng.",
            "Kinh tế toàn cầu ảnh hưởng trực tiếp đến từng quốc gia.",
            "Các tổ chức quốc tế đang thúc đẩy hợp tác và hòa bình."
        ]
    },
    "68c195c601a6496adab2f9b5": {  # Xe cộ
        "tags": ["xe điện", "ô tô", "xe máy", "giao thông", "siêu xe"],
        "titles": [
            "Xu hướng xe điện tại Việt Nam",
            "Siêu xe và thú chơi của giới thượng lưu",
            "Giao thông thông minh – Tương lai gần"
        ],
        "content_templates": [
            "Xe điện đang dần thay thế xe xăng.",
            "Siêu xe luôn là biểu tượng của sự xa hoa.",
            "Hệ thống giao thông thông minh sẽ giúp giảm ùn tắc đô thị."
        ]
    },
    "68c195cf01a6496adab2f9b6": {  # Ẩm thực
        "tags": ["ẩm thực", "món ăn", "ẩm thực Việt", "ẩm thực châu Á", "street food"],
        "titles": [
            "Ẩm thực Việt Nam – Hồn cốt dân tộc",
            "Street food Việt Nam hút hồn du khách quốc tế",
            "Xu hướng ẩm thực châu Á 2024"
        ],
        "content_templates": [
            "Ẩm thực là nét văn hóa đặc sắc của Việt Nam.",
            "Street food mang lại trải nghiệm độc đáo cho du khách.",
            "Ẩm thực châu Á đang dần khẳng định vị thế toàn cầu."
        ]
    },
    "68c195d801a6496adab2f9b7": {  # Thời trang
        "tags": ["thời trang", "trend", "thiết kế", "local brand", "sustainable fashion"],
        "titles": [
            "Xu hướng thời trang 2024",
            "Sustainable fashion – Thời trang bền vững",
            "Local brand Việt Nam vươn ra thế giới"
        ],
        "content_templates": [
            "Ngành thời trang đang thay đổi nhanh chóng.",
            "Thời trang bền vững được giới trẻ quan tâm.",
            "Local brand Việt Nam ngày càng khẳng định vị trí."
        ]
    },

    "68c1959001a6496adab2f9b0": {  # Khoa học
        "tags": ["khoa học", "thiên văn", "vũ trụ", "năng lượng", "vật liệu mới"],
        "titles": [
            "Khám phá hố đen vũ trụ: Bí ẩn chưa có lời giải",
            "Pin năng lượng mặt trời thế hệ mới",
            "Siêu máy tính và cuộc cách mạng khoa học dữ liệu"
        ],
        "content_templates": [
            "Khoa học hiện đại mở ra nhiều hướng nghiên cứu mới.",
            "Các nhà khoa học Việt Nam đóng góp nhiều công trình giá trị.",
            "Công nghệ lượng tử đang trở thành xu hướng toàn cầu."
        ]
    },
    "68c1959a01a6496adab2f9b1": {  # Du lịch
        "tags": ["du lịch", "khám phá", "homestay", "phượt", "ẩm thực địa phương"],
        "titles": [
            "10 điểm đến hấp dẫn nhất Đông Nam Á",
            "Khám phá Tây Bắc – Nét đẹp núi rừng hùng vĩ",
            "Homestay độc đáo cho kỳ nghỉ cuối tuần"
        ],
        "content_templates": [
            "Du lịch không chỉ là nghỉ dưỡng mà còn là trải nghiệm văn hóa.",
            "Ẩm thực đường phố là điểm nhấn thu hút du khách.",
            "Du lịch xanh và bền vững là xu hướng tương lai."
        ]
    },
    "68c195cf01a6496adab2f9b6": {  # Ẩm thực
        "tags": ["ẩm thực", "ẩm thực Việt", "street food", "fusion", "ẩm thực quốc tế"],
        "titles": [
            "Phở Việt Nam – Hồn cốt ẩm thực dân tộc",
            "Ẩm thực fusion: Sự kết hợp Đông – Tây độc đáo",
            "Street food châu Á chinh phục du khách toàn cầu"
        ],
        "content_templates": [
            "Ẩm thực Việt Nam nổi bật với sự đa dạng và tinh tế.",
            "Các món ăn truyền thống mang đậm dấu ấn văn hóa.",
            "Ẩm thực hiện đại kết hợp sáng tạo với hương vị truyền thống."
        ]
    },
    "68c195d801a6496adab2f9b7": {  # Thời trang
        "tags": ["thời trang", "xu hướng", "local brand", "sustainable fashion"],
        "titles": [
            "Xu hướng thời trang đường phố 2024",
            "Thời trang bền vững và trách nhiệm xã hội",
            "Local brand Việt Nam vươn tầm thế giới"
        ],
        "content_templates": [
            "Ngành thời trang đang thay đổi theo từng mùa.",
            "Local brand Việt Nam được giới trẻ yêu thích.",
            "Thời trang bền vững dần trở thành xu thế toàn cầu."
        ]
    },
    "68c195b401a6496adab2f9b3": {  # Môi trường
        "tags": ["môi trường", "khí hậu", "tái chế", "năng lượng sạch"],
        "titles": [
            "Năng lượng tái tạo – Lời giải cho biến đổi khí hậu",
            "Tái chế nhựa: Xu hướng tất yếu của xã hội hiện đại",
            "Hành tinh xanh – Trách nhiệm chung của nhân loại"
        ],
        "content_templates": [
            "Môi trường đang chịu áp lực lớn từ công nghiệp hóa.",
            "Các chiến dịch bảo vệ môi trường ngày càng lan tỏa.",
            "Sử dụng năng lượng sạch là xu hướng toàn cầu."
        ]
    },
    "68c1958801a6496adab2f9af": {  # Giáo dục
        "tags": ["giáo dục", "STEM", "kỹ năng mềm", "e-learning"],
        "titles": [
            "Giáo dục trực tuyến: Xu hướng tất yếu",
            "STEM trong giáo dục phổ thông Việt Nam",
            "Kỹ năng mềm – Chìa khóa thành công cho sinh viên"
        ],
        "content_templates": [
            "Giáo dục đang thay đổi mạnh mẽ với sự hỗ trợ của công nghệ.",
            "STEM giúp đào tạo thế hệ trẻ thích ứng với thời đại số.",
            "Kỹ năng mềm ngày càng quan trọng trong xã hội hiện đại."
        ]
    },
    "68c195c601a6496adab2f9b5": {  # Xe cộ
        "tags": ["xe điện", "ô tô", "giao thông thông minh", "siêu xe"],
        "titles": [
            "Xu hướng xe điện bùng nổ tại Việt Nam",
            "Tương lai của giao thông đô thị thông minh",
            "Siêu xe – Biểu tượng của đẳng cấp"
        ],
        "content_templates": [
            "Xe điện dần trở thành lựa chọn thay thế cho xe xăng.",
            "Giao thông thông minh giúp giảm ùn tắc và ô nhiễm.",
            "Thị trường siêu xe ngày càng sôi động."
        ]
    },
    "68c195bd01a6496adab2f9b4": {  # Thế giới
        "tags": ["thế giới", "quốc tế", "kinh tế toàn cầu", "xung đột"],
        "titles": [
            "Những biến động lớn của thế giới năm 2024",
            "Kinh tế toàn cầu và cơ hội cho Việt Nam",
            "Hòa bình và hợp tác quốc tế trong thế kỷ 21"
        ],
        "content_templates": [
            "Thế giới đang trải qua nhiều biến động.",
            "Các nền kinh tế lớn có tác động mạnh đến khu vực.",
            "Hợp tác quốc tế ngày càng đóng vai trò quan trọng."
        ]
    },
    "68c195a201a6496adab2f9b2": {  # Phong cách sống
        "tags": ["lifestyle", "minimalism", "gen Z", "wellness"],
        "titles": [
            "Lối sống tối giản – Xu hướng mới",
            "Gen Z và phong cách sống xanh",
            "Wellness – Sống khỏe cả thể chất và tinh thần"
        ],
        "content_templates": [
            "Phong cách sống thay đổi theo từng thế hệ.",
            "Minimalism giúp con người cân bằng trong xã hội hiện đại.",
            "Wellness là lựa chọn phổ biến của giới trẻ."
        ]
    }

}

# ====================================================

# ---------------- helper ----------------
def random_string(n=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))


def get_random_image():
    """Lấy ngẫu nhiên một ảnh từ thư mục IMAGE_FOLDER"""
    try:
        image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.webp']
        image_files = []
        for ext in image_extensions:
            image_files.extend(glob.glob(os.path.join(IMAGE_FOLDER, ext)))
            image_files.extend(glob.glob(os.path.join(IMAGE_FOLDER, ext.upper())))
        if not image_files:
            print("⚠️ Không tìm thấy ảnh nào trong thư mục IMAGE_FOLDER:", IMAGE_FOLDER)
            return None
        return random.choice(image_files)
    except Exception as e:
        print(f"❌ Lỗi khi lấy ảnh: {e}")
        return None


def generate_smart_title(category_id):
    if category_id in category_data:
        return random.choice(category_data[category_id]["titles"])
    else:
        prefix = ["Tin nóng", "Cập nhật", "Xu hướng", "Phân tích", "Báo cáo", "Khám phá", "Tìm hiểu"]
        topics = ["thị trường", "công nghệ", "xã hội", "văn hóa", "kinh tế", "đời sống"]
        return f"{random.choice(prefix)}: {random.choice(topics)} {random.randint(2024, 2025)}"


def generate_smart_description(category_id, tags):
    """Tạo mô tả hấp dẫn và SEO-friendly (giới hạn ~200 ký tự)"""
    description_templates = [
        "Khám phá {topic} - {benefit} mà bạn không nên bỏ lỡ. Phân tích chuyên sâu từ các chuyên gia hàng đầu về {focus_area} trong thời đại hiện đại.",
        "Cập nhật mới nhất về {topic}: {insight} và những xu hướng định hình tương lai. Tìm hiểu {practical_value} cho {target_audience}.",
        "Bài viết phân tích toàn diện về {topic} - từ {aspect1} đến {aspect2}. Những thông tin {quality} giúp bạn {action} một cách hiệu quả."
    ]

    # Các từ khóa cho một vài category (có thể mở rộng)
    category_keywords = {
        "68c1952e01a6496adab2f9aa": {
            "topics": ["trí tuệ nhân tạo", "blockchain", "công nghệ 5G", "IoT", "machine learning"],
            "benefits": ["những đột phá công nghệ", "giải pháp thông minh"],
            "focus_areas": ["chuyển đổi số", "đổi mới sáng tạo"],
            "practical_values": ["ứng dụng thực tế", "lợi ích kinh tế"],
            "target_audiences": ["doanh nghiệp", "nhà đầu tư"]
        },
        "68c1956e01a6496adab2f9ac": {
            "topics": ["startup", "đầu tư", "thương mại điện tử"],
            "benefits": ["cơ hội kinh doanh", "lợi nhuận bền vững"],
            "focus_areas": ["chiến lược kinh doanh", "phát triển thị trường"],
            "practical_values": ["lợi ích thực tế"],
            "target_audiences": ["nhà đầu tư", "doanh nghiệp"]
        },
        "68c1957701a6496adab2f9ad": {
            "topics": ["sức khỏe", "dinh dưỡng", "y học hiện đại"],
            "benefits": ["lợi ích cho sức khỏe", "phòng ngừa bệnh tật"],
            "focus_areas": ["chăm sóc sức khỏe", "y học dự phòng"],
            "practical_values": ["hướng dẫn chăm sóc"], 
            "target_audiences": ["mọi người", "bệnh nhân"]
        }
    }

    template = random.choice(description_templates)
    if category_id in category_keywords:
        kw = category_keywords[category_id]
    else:
        kw = {
            "topics": [tags[0].lower() if tags else "xu hướng mới"],
            "benefits": ["nhiều lợi ích"],
            "focus_areas": ["lĩnh vực này"],
            "practical_values": ["kiến thức hữu ích"],
            "target_audiences": ["người đọc"]
        }

    vals = {
        "topic": random.choice(kw.get("topics", ["xu hướng"])),
        "benefit": random.choice(kw.get("benefits", ["lợi ích"])),
        "focus_area": random.choice(kw.get("focus_areas", ["lĩnh vực"])),
        "insight": random.choice(["những phân tích chuyên sâu", "dữ liệu mới nhất"]),
        "practical_value": random.choice(kw.get("practical_values", ["giá trị thực tiễn"])),
        "target_audience": random.choice(kw.get("target_audiences", ["người đọc"])),
        "aspect1": "lý thuyết cơ bản",
        "aspect2": "ứng dụng thực tế",
        "quality": "đáng tin cậy",
        "action": "nắm bắt cơ hội"
    }

    try:
        description = template.format(**vals)
        if len(description) > 200:
            description = description[:197] + "..."
        return description
    except Exception:
        main_tag = tags[0] if tags else "chủ đề"
        return f"Bài viết phân tích chuyên sâu về {main_tag.lower()}, cung cấp những thông tin hữu ích - {random_string(6)}"


def generate_quality_content(category_id):
    """Sinh nội dung chi tiết theo từng category (intro + main + 9 analysis + conclusion)"""

    # Intro và kết luận dùng chung
    intro_pool = [
        "Trong bối cảnh toàn cầu hóa, sự thay đổi đang diễn ra với tốc độ chóng mặt...",
        "Thế giới ngày nay đang chứng kiến nhiều xu hướng mới nổi bật...",
        "Những bước tiến vượt bậc đã định hình lại cách con người sống và làm việc..."
    ]
    conclusion_pool = [
        "Tương lai sẽ còn nhiều cơ hội cũng như thách thức, nhưng chắc chắn chúng ta đang đi đúng hướng.",
        "Có thể khẳng định rằng sự phát triển này mở ra chương mới đầy tiềm năng cho xã hội."
    ]

    # Nội dung chính theo từng category
    main_content_map = {
        "68c1959001a6496adab2f9b0": "Khoa học hiện đại mở ra nhiều cơ hội nghiên cứu mang tính đột phá...",
        "68c1959a01a6496adab2f9b1": "Ngành du lịch đang trở thành động lực phát triển kinh tế – xã hội...",
        "68c195cf01a6496adab2f9b6": "Ẩm thực luôn là nét đặc trưng văn hóa hấp dẫn của mỗi quốc gia...",
        "68c195d801a6496adab2f9b7": "Thời trang phản ánh gu thẩm mỹ và phong cách sống của từng thế hệ...",
        "68c195b401a6496adab2f9b3": "Môi trường là mối quan tâm toàn cầu với nhiều thách thức cấp bách...",
        "68c1958801a6496adab2f9af": "Giáo dục là nền tảng cho sự phát triển bền vững của một quốc gia...",
        "68c195c601a6496adab2f9b5": "Ngành xe cộ đang bước vào thời kỳ chuyển mình mạnh mẽ...",
        "68c195bd01a6496adab2f9b4": "Tình hình thế giới luôn biến động và có tác động trực tiếp đến Việt Nam...",
        "68c195a201a6496adab2f9b2": "Phong cách sống ngày càng đa dạng và phản ánh giá trị thế hệ trẻ..."
    }

    # Các phân tích chuyên biệt cho từng category
    analysis_map = {
        "68c1959001a6496adab2f9b0": [  # Khoa học
            "Các nhà khoa học đã công bố nhiều nghiên cứu đột phá trong năm qua.",
            "Công nghệ lượng tử được xem là nền tảng cho thế kỷ 21.",
            "Hợp tác quốc tế giúp đẩy nhanh tiến bộ khoa học."
        ],
        "68c1959a01a6496adab2f9b1": [  # Du lịch
            "Việt Nam lọt top điểm đến được yêu thích tại châu Á.",
            "Homestay và du lịch cộng đồng ngày càng được quan tâm.",
            "Ẩm thực là yếu tố quan trọng thu hút khách du lịch."
        ],
        "68c195cf01a6496adab2f9b6": [  # Ẩm thực
            "Ẩm thực Việt Nam nổi tiếng với sự hài hòa hương vị.",
            "Street food mang lại trải nghiệm độc đáo cho du khách.",
            "Xu hướng fusion cuisine ngày càng phổ biến."
        ],
        "68c195d801a6496adab2f9b7": [  # Thời trang
            "Xu hướng thời trang bền vững được nhiều thương hiệu theo đuổi.",
            "Local brand Việt Nam ngày càng khẳng định vị thế.",
            "Thời trang đường phố được giới trẻ ưa chuộng."
        ],
        "68c195b401a6496adab2f9b3": [  # Môi trường
            "Biến đổi khí hậu đang đe dọa nghiêm trọng hệ sinh thái.",
            "Năng lượng tái tạo giúp giảm phát thải khí nhà kính.",
            "Các chiến dịch bảo vệ môi trường lan tỏa rộng rãi."
        ],
        "68c1958801a6496adab2f9af": [  # Giáo dục
            "STEM đóng vai trò quan trọng trong đào tạo thế hệ mới.",
            "E-learning giúp việc học tập linh hoạt hơn.",
            "Kỹ năng mềm trở thành yếu tố then chốt để thành công."
        ],
        "68c195c601a6496adab2f9b5": [  # Xe cộ
            "Xe điện đang dần thay thế xe xăng trong đô thị.",
            "Hệ thống giao thông thông minh giúp giảm ùn tắc.",
            "Thị trường siêu xe vẫn giữ sức hút với giới thượng lưu."
        ],
        "68c195bd01a6496adab2f9b4": [  # Thế giới
            "Kinh tế toàn cầu có nhiều biến động trong năm 2024.",
            "Xung đột chính trị ảnh hưởng lớn đến hòa bình khu vực.",
            "Các tổ chức quốc tế đang thúc đẩy hợp tác đa phương."
        ],
        "68c195a201a6496adab2f9b2": [  # Phong cách sống
            "Gen Z đề cao lối sống xanh và bền vững.",
            "Minimalism giúp cân bằng cuộc sống hiện đại.",
            "Wellness ngày càng trở thành xu hướng được quan tâm."
        ]
    }

    # Xử lý chọn nội dung
    intro = random.choice(intro_pool)
    main_content = main_content_map.get(category_id, "Xu hướng mới đang hình thành và tác động đến xã hội.")
    analysis_sections = random.sample(
        analysis_map.get(category_id, [
            "Sự thay đổi này đang mang lại cả cơ hội và thách thức.",
            "Nhiều quốc gia đang tích cực thích ứng với xu hướng mới.",
            "Yếu tố con người luôn là trung tâm của mọi thay đổi."
        ]),
        k=min(3, len(analysis_map.get(category_id, [])))
    )

    # Bổ sung thêm 6 phân tích chung để đủ 9
    generic_analysis = [
        "Theo báo cáo mới nhất, xu hướng này có tốc độ tăng trưởng nhanh.",
        "Nhiều chuyên gia nhận định rằng sự thay đổi này là tất yếu.",
        "Sự hợp tác công – tư được xem là động lực quan trọng.",
        "Công nghệ đóng vai trò cốt lõi trong quá trình phát triển.",
        "Người trẻ là lực lượng thúc đẩy chính cho xu hướng này.",
        "Chính phủ nhiều nước đã ban hành chính sách hỗ trợ.",
        "Thị trường vốn phản ứng tích cực với các thay đổi.",
        "Các trường học cập nhật chương trình để bắt kịp xu hướng."
    ]
    while len(analysis_sections) < 9:
        analysis_sections.append(random.choice(generic_analysis))

    conclusion = random.choice(conclusion_pool)

    # Ghép nội dung
    full_content = [intro, main_content] + analysis_sections + [conclusion]
    return "\n\n".join(full_content)

    """Tạo nội dung chất lượng (cố định 12 đoạn: intro + main + 9 phân tích + conclusion)"""
    intro_pool = [
        "Trong kỷ nguyên toàn cầu hóa và số hóa, những thay đổi diễn ra với tốc độ chưa từng có...",
        "Thế kỷ 21 đã chứng kiến sự xuất hiện của nhiều xu hướng mang tính đột phá...",
        "Cuộc cách mạng công nghiệp 4.0 không chỉ là một khái niệm xa vời mà đã trở thành hiện thực..."
    ]

    main_content_pool = {
        "tech": [
            "Trí tuệ nhân tạo đang trải qua một cuộc cách mạng thực sự...",
            "Blockchain và Web3 đang mở ra một kỷ nguyên mới của internet phi tập trung...",
        ],
        "business": [
            "Nền kinh tế số đang thay đổi căn bản cách thức hoạt động của các doanh nghiệp...",
        ],
        "health": [
            "Y học cá nhân hóa và công nghệ gene đang cách mạng hóa việc điều trị bệnh tật...",
        ],
        "general": [
            "Xu hướng này đang thu hút sự quan tâm to lớn từ cộng đồng quốc tế..."
        ]
    }

    analysis_pool = [
        "Theo nghiên cứu từ các viện đại học hàng đầu, xu hướng này có tốc độ tăng trưởng lớn.",
        "Từ góc nhìn kinh tế vĩ mô, sự phát triển này đang tạo ra nhiều việc làm mới.",
        "Các tập đoàn lớn đã đầu tư hàng tỷ đô la vào lĩnh vực này.",
        "Về mặt địa lý, châu Á đang dẫn đầu trong việc áp dụng xu hướng này.",
        "Tác động môi trường được xem là yếu tố quan trọng cần quan tâm.",
        "Thách thức lớn nhất hiện tại là vấn đề bảo mật và quyền riêng tư dữ liệu.",
        "Giới trẻ đang thúc đẩy sự thay đổi này một cách mạnh mẽ.",
        "Các chính phủ đang ban hành chính sách hỗ trợ mạnh mẽ.",
        "Về giáo dục, nhiều trường đã cập nhật chương trình giảng dạy phù hợp.",
        "Sự hợp tác quốc tế cũng được tăng cường thông qua hiệp định và chương trình.",
        "Ngành y tế được cải tiến với telemedicine và AI hỗ trợ chẩn đoán.",
        "Trong nông nghiệp, precision farming giúp tăng năng suất.",
        "Thị trường vốn phản ứng tích cực với các quỹ ESG.",
        "Văn hóa pha trộn giữa truyền thống và hiện đại tạo ra sản phẩm độc đáo.",
        "Yếu tố con người vẫn là trung tâm của mọi sự thay đổi."
    ]

    conclusion_pool = [
        "Nhìn về tương lai, có thể khẳng định rằng chúng ta đang sống trong một thời đại của những cơ hội vô hạn.",
        "Tóm lại, sự hội tụ của công nghệ và xã hội đang mở ra chương mới cho nhân loại."
    ]

    # chọn loại main content dựa trên category tags
    if category_id in category_data:
        tags = category_data[category_id].get("tags", [])
        if "AI" in tags or "machine learning" in tags:
            main_choices = main_content_pool.get("tech", main_content_pool["general"])
        elif "doanh nghiệp" in tags or "startup" in tags:
            main_choices = main_content_pool.get("business", main_content_pool["general"])
        elif "sức khỏe" in tags or "dinh dưỡng" in tags:
            main_choices = main_content_pool.get("health", main_content_pool["general"])
        else:
            main_choices = main_content_pool.get("general")
    else:
        main_choices = main_content_pool["general"]

    intro = random.choice(intro_pool)
    main_content = random.choice(main_choices)

    # **Cố định 9 đoạn phân tích** để tổng thành 12 đoạn (1 intro + 1 main + 9 analysis + 1 conclusion)
    analysis_sections = random.sample(analysis_pool, k=9)
    conclusion = random.choice(conclusion_pool)

    full_content = [intro, main_content] + analysis_sections + [conclusion]
    return "\n\n".join(full_content)
# ---------------- end helper ----------------


def create_posts(num_posts=500):
    successful_posts = 0
    failed_posts = 0    

    # Kiểm tra folder ảnh tồn tại
    if not os.path.isdir(IMAGE_FOLDER):
        print("⚠️ IMAGE_FOLDER không tồn tại:", IMAGE_FOLDER)
        return

    for i in range(num_posts):
        try:
            category_id = random.choice(list(category_data.keys()))
            image_path = get_random_image()
            if not image_path:
                print(f"⚠️ Bỏ qua post {i+1} do không có ảnh")
                failed_posts += 1
                continue

            available_tags = category_data[category_id]["tags"]
            tags = random.sample(available_tags, k=min(random.randint(2, 4), len(available_tags)))

            post_data = {
                "title": generate_smart_title(category_id),
                "description": generate_smart_description(category_id, tags),
                "content": generate_quality_content(category_id),
                "categoryId": category_id,
                "tags": tags,
                "status": "PUBLISHED"
            }

            image_name = Path(image_path).name
            mime_type, _ = mimetypes.guess_type(image_path)
            if mime_type is None:
                # Fallback
                ext = Path(image_path).suffix.lower().lstrip('.')
                mime_type = f"image/{ext}" if ext else "application/octet-stream"

            # Nếu DRY_RUN = True thì chỉ in payload, không gửi
            if DRY_RUN:
                print(f"\n--- DRY_RUN Post {i+1} ---")
                print("Title:", post_data["title"])
                print("Description:", post_data["description"][:120], "...")
                print("Tags:", post_data["tags"])
                print("Image:", image_path)
                continue

            # Gửi request - dùng with để tự đóng file
            with open(image_path, "rb") as f:
                files = {
                    "file": (image_name, f, mime_type),
                    "post": (None, json.dumps(post_data, ensure_ascii=False), "application/json")
                }
                res = requests.post(URL, headers=HEADERS, files=files, timeout=30)

            if res.status_code in (200, 201):
                successful_posts += 1
                print(f"✅ [{i+1}/{num_posts}] {post_data['title'][:50]}... -> {res.status_code}")
            else:
                failed_posts += 1
                # In body ngắn gọn để debug
                text_preview = res.text[:300].replace("\n", " ")
                print(f"❌ [{i+1}/{num_posts}] Failed: {res.status_code} - {text_preview}")

        except Exception as e:
            failed_posts += 1
            print(f"❌ Error at post {i+1}: {e}")

        # Nghỉ ngắn giữa các request
        time.sleep(random.uniform(0.1, 0.5))

    print(f"\n📊 Kết quả: {successful_posts} thành công, {failed_posts} thất bại")


if __name__ == "__main__":
    print("🚀 Bắt đầu tạo posts...")
    create_posts(500)
    print("🎉 Hoàn thành!")
