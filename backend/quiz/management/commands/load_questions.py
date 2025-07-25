from django.core.management.base import BaseCommand
from quiz.models import Section, Question

class Command(BaseCommand):
    help = 'Loads quiz sections and questions into the database'

    def handle(self, *args, **options):
        # Define sections
        sections_data = [
            {'key': 'thoughts', 'name': 'افکار'},
            {'key': 'behavior', 'name': 'رفتار'},
            {'key': 'awareness', 'name': 'آگاهی'},
            {'key': 'belief', 'name': 'عقیده'},
            {'key': 'style', 'name': 'استایل'},
            {'key': 'values', 'name': 'ارزش‌ها'},
            {'key': 'experiences', 'name': 'تجربیات'},
            {'key': 'family', 'name': 'خانواده'},
            {'key': 'skills', 'name': 'مهارت‌ها'},
            {'key': 'social', 'name': 'موقعیت اجتماعی'},
        ]

        # Create or get sections
        section_objects = {}
        for section in sections_data:
            obj, created = Section.objects.get_or_create(
                key=section['key'],
                defaults={'name': section['name']}
            )
            section_objects[section['key']] = obj

        # Define questions
        questions_data = [
            # Section: Thoughts
            {'section': 'thoughts', 'text': 'آیا افکارم بیشتر به گذشته، حال، یا آینده معطوف است؟', 'order': 1},
            {'section': 'thoughts', 'text': 'آیا افکارم عمدتاً سازنده (راه حل محور) هستند یا مخرب (مشکل محور)؟', 'order': 2},
            {'section': 'thoughts', 'text': 'چقدر توانایی تشخیص افکار منفی و هدایت به افکار مثبت را دارم؟', 'order': 3},
            {'section': 'thoughts', 'text': 'چقدر افکارم به رشد شخصی و پیشرفتم کمک میکند یا صرفاً تکراری و غیرمفید است؟', 'order': 4},
            {'section': 'thoughts', 'text': 'افکارم بیشتر به خودم متمرکز است یا به دیگران و روابطم؟', 'order': 5},
            # Section: Behavior
            {'section': 'behavior', 'text': 'آیا رفتارم با انتظارات اجتماعی و سِنی ام همخوانی دارد؟', 'order': 1},
            {'section': 'behavior', 'text': 'چقدر در رفتار و تصمیماتم احساس مسئولیت میکنم؟', 'order': 2},
            {'section': 'behavior', 'text': 'چقدر در برابر فشارهای اجتماعی یا وسوسه‌ها میتوانم مقاومت کنم؟', 'order': 3},
            {'section': 'behavior', 'text': 'کدام رفتارهایم را دوست دارم و کدامها را میخواهم تغییر دهم؟', 'order': 4},
            {'section': 'behavior', 'text': 'آیا رفتارهایم تحت تأثیر ترس، ناامنی، یا نیاز به تأیید دیگران است؟', 'order': 5},
            # Section: Awareness
            {'section': 'awareness', 'text': 'چقدر شناخت نسبت به نقاط ضعف و قوت خود دارم؟', 'order': 1},
            {'section': 'awareness', 'text': 'آیا به احساسات و انگیزه‌هایم توجه میکنم یا صرفاً واکنش نشان میدهم؟', 'order': 2},
            {'section': 'awareness', 'text': 'تا چه حد از تأثیر رفتارهایم بر دیگران آگاهم؟', 'order': 3},
            {'section': 'awareness', 'text': 'آیا در موقعیتهای چالش برانگیز میتوانم آرامش خود را حفظ کنم و تصمیمات آگاهانه بگیرم؟', 'order': 4},
            {'section': 'awareness', 'text': 'چقدر به بازخورد دیگران درباره خودم توجه میکنم و از آن برای بهبود خود استفاده میکنم؟', 'order': 5},
            # Section: Belief
            {'section': 'belief', 'text': 'چقدر به باورها و عقایدم پایبندم و آیا آنها را مرتب بازنگری میکنم؟', 'order': 1},
            {'section': 'belief', 'text': 'آیا عقایدم بر اساس تجربه شخصی شکل گرفته‌اند یا تحت تأثیر محیط و دیگران هستند؟', 'order': 2},
            {'section': 'belief', 'text': 'چقدر در برابر عقاید مخالف انعطاف‌پذیرم و میتوانم آنها را بررسی کنم؟', 'order': 3},
            {'section': 'belief', 'text': 'آیا عقایدم به من انگیزه برای رشد و پیشرفت میدهند یا محدودم میکنند؟', 'order': 4},
            {'section': 'belief', 'text': 'چقدر عقایدم با ارزشهای اخلاقی و اجتماعی‌ام هم‌راستاست؟', 'order': 5},
            # Section: Style
            {'section': 'style', 'text': 'چقدر سبک زندگی و ظاهر من بیانگر شخصیت واقعی‌ام است؟', 'order': 1},
            {'section': 'style', 'text': 'آیا انتخاب‌هایم در استایل (لباس، رفتار، محیط) آگاهانه و با ارزشها و اهدافم همخوانی دارد یا صرفاً تقلید از محیط و جامعه است؟', 'order': 2},
            {'section': 'style', 'text': 'چقدر در انتخاب استایل خود تحت تأثیر مد یا نظر دیگران هستم؟', 'order': 3},
            {'section': 'style', 'text': 'آیا استایل من به من اعتماد به نفس میدهد یا به دنبال تأیید دیگرانم؟', 'order': 4},
            {'section': 'style', 'text': 'چقدر در موقعیتهای مختلف (رسمی، غیررسمی) استایل متناسبی انتخاب میکنم؟', 'order': 5},
            # Section: Values
            {'section': 'values', 'text': 'چقدر ارزش‌هایم را به وضوح میشناسم و آنها را در زندگی پیاده میکنم؟', 'order': 1},
            {'section': 'values', 'text': 'ارزش‌هایم چه چیزی درباره من میگویند؟ و آیا در تصمیم‌گیری ارزشهایم را در اولویت قرار میدهم؟', 'order': 2},
            {'section': 'values', 'text': 'چقدر ارزشهایم با رفتارهای روزمره‌ام هم‌راستاست؟', 'order': 3},
            {'section': 'values', 'text': 'آیا ارزشهایم با ارزشهای جامعه یا خانواده‌ام در تعارض است؟ اگر بله، چگونه آن را مدیریت میکنم؟', 'order': 4},
            {'section': 'values', 'text': 'چقدر به ارزشهای دیگران احترام میگذارم، حتی اگر با من متفاوت باشند؟', 'order': 5},
            # Section: Experiences
            {'section': 'experiences', 'text': 'چقدر از تجربیات گذشته‌ام درس گرفتم و آنها را در زندگیم به کار میبرم؟', 'order': 1},
            {'section': 'experiences', 'text': 'آیا تجربیاتم به من کمک کرده‌اند تا انعطاف‌پذیرتر و قویتر شوم؟', 'order': 2},
            {'section': 'experiences', 'text': 'چقدر از شکستهایم به عنوان فرصتی برای یادگیری استفاده کردم؟', 'order': 3},
            {'section': 'experiences', 'text': 'آیا آنها را به عنوان فرصتی برای رشد میبینم یا مانعی برای پیشرفت؟', 'order': 4},
            {'section': 'experiences', 'text': 'چقدر از تجربیاتم برای کمک به دیگران استفاده میکنم؟', 'order': 5},
            # Section: Family
            {'section': 'family', 'text': 'چقدر روابطم با خانواده سالم و حمایت‌کننده است؟', 'order': 1},
            {'section': 'family', 'text': 'آیا تأثیرات خانواده‌ام بر شخصیت و تصمیماتم مثبت بوده یا منفی؟', 'order': 2},
            {'section': 'family', 'text': 'چقدر در نقشهای خانوادگیم (فرزند، والد، همسر) احساس رضایت میکنم؟', 'order': 3},
            {'section': 'family', 'text': 'آیا میتوانم بین نیازهای خانواده و نیازهای شخصیم تعادل برقرار کنم؟', 'order': 4},
            {'section': 'family', 'text': 'چقدر ارزشهای خانوادگیم با ارزشهای شخصیم همخوانی دارد؟', 'order': 5},
            # Section: Skills
            {'section': 'skills', 'text': 'مهارت‌هایم چگونه به من کمک میکنند تا در زندگی موفق باشم؟ و آیا به اندازه کافی روی آنها کار میکنم؟', 'order': 1},
            {'section': 'skills', 'text': 'آیا به طور مداوم در حال یادگیری و بهبود مهارتهایم هستم؟', 'order': 2},
            {'section': 'skills', 'text': 'چقدر در مهارتهای ارتباطی و تعامل اجتماعی قوی هستم؟', 'order': 3},
            {'section': 'skills', 'text': 'آیا مهارتهایم با نیازهای شغلی یا زندگیم همخوانی دارد؟', 'order': 4},
            {'section': 'skills', 'text': 'چقدر به تواناییهایم اعتماد دارم و آنها را به دیگران نشان میدهم؟', 'order': 5},
            # Section: Social
            {'section': 'social', 'text': 'چقدر در روابط اجتماعیم احساس راحتی و اعتماد به نفس میکنم؟', 'order': 1},
            {'section': 'social', 'text': 'آیا در جامعه به عنوان فردی مثبت و تأثیرگذار شناخته میشوم؟', 'order': 2},
            {'section': 'social', 'text': 'چقدر در فعالیتهای اجتماعی یا گروهی مشارکت فعال دارم؟', 'order': 3},
            {'section': 'social', 'text': 'آیا روابط و نقشهای اجتماعیم به من حس رضایت میدهند؟', 'order': 4},
            {'section': 'social', 'text': 'چقدر به تأثیر رفتارم بر جامعه اطرافم توجه دارم؟', 'order': 5},
        ]

        try:
            # Load questions
            for question in questions_data:
                section = section_objects[question['section']]
                Question.objects.get_or_create(
                    section=section,
                    order=question['order'],
                    defaults={'text': question['text']}
                )
            self.stdout.write(self.style.SUCCESS('Sections and questions loaded successfully'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading sections and questions: {str(e)}'))