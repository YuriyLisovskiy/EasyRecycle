from django.test import TestCase

from core.utils import build_full_url


class BuildFullUrlTestCase(TestCase):

    class MockedRequest:

        @staticmethod
        def build_absolute_uri(url):
            return '/some/{}'.format(url)

    class MockedImage:

        @property
        def url(self):
            return 'image.png'

    def test_build_full_url(self):
        request = self.MockedRequest()
        image = self.MockedImage()
        self.assertEqual(build_full_url(request, image), '/some/image.png')
