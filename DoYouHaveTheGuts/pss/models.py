"""
Models for pss
"""
from django.db import models


# Based on https://www.isp.state.il.us/docs/6-260.pdf
TYPE_CHOICES = (
    ('HOMICIDE', 'HOMICIDE'),
    ('CRIMINAL SEXUALASSAULT', 'CRIMINAL SEXUALASSAULT'),
    ('ROBBERY', 'ROBBERY'),
    ('BATTERY', 'BATTERY'),
    ('RITUALISM', 'RITUALISM'),
    ('ASSAULT', 'ASSAULT'),
    ('BURGLARY', 'BURGLARY'),
    ('BURGLARY ORTHEFT FROM MOTOR VEHICL', 'BURGLARY ORTHEFT FROM MOTOR VEHICL'),
    ('THEFT', 'THEFT'),
    ('MOTOR VEHICLE THEFT', 'MOTOR VEHICLE THEFT'),
    ('ARSON', 'ARSON'),
    ('DECEPTIVE PRACTICES', 'DECEPTIVE PRACTICES'),
    ('CRIMINAL DAMAGE &TRESPASS TOPROPERTY', 'CRIMINAL DAMAGE &TRESPASS TOPROPERTY'),
    ('DEADLY WEAPONS', 'DEADLY WEAPONS'),
    ('SEX OFFENSES', 'SEX OFFENSES'),
    ('GAMBLING', 'GambGAMBLINGling'),
    ('OFFENSES INVOLVING CHILDREN', 'OFFENSES INVOLVING CHILDREN'),
    ('CANNABIS CONTROL ACT', 'CANNABIS CONTROL ACT'),
    ('METHAMPHETAMINE OFFENSES', 'METHAMPHETAMINE OFFENSES'),
    ('CONTROLLED SUBSTANCE ACT', 'CONTROLLED SUBSTANCE ACT'),
    ('HYPODERMIC SYRINGES & NEEDLES ACT', 'HYPODERMIC SYRINGES & NEEDLES ACT'),
    ('DRUG PARAPHERNALIA ACT', 'DRUG PARAPHERNALIA ACT'),
    ('LIQUOR CONTROLACT VIOLATIONS', 'LIQUOR CONTROLACT VIOLATIONS'),
    ('INTOXICATING COMPOUND', 'INTOXICATING COMPOUND'),
    ('MOTOR VEHICLE OFFENSES', 'MOTOR VEHICLE OFFENSES'),
    ('CRIMINAL ABORTION', 'CRIMINAL ABORTION'),
    ('DISORDERLY CONDUCT', 'DISORDERLY CONDUCT'),
    ('INTERFERENCE WITH PUBLIC OFFICERS', 'INTERFERENCE WITH PUBLIC OFFICERS'),
    ('INTIMIDATION', 'INTIMIDATION'),
    ('KIDNAPPING', 'KIDNAPPING'),
    ('HREAT -TERRORISM', 'HREAT -TERRORISM'),
    ('VIOLATIONOF CRIMINAL REGISTRY LAW', 'VIOLATIONOF CRIMINAL REGISTRY LAW'),
    ('OTHER OFFENSES', 'OTHER OFFENSES')
)


class Station(models.Model):
    """
    Model to hold police station data
    District 26 is headquarters
    """
    district = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500, default='')
    latitude = models.DecimalField(max_digits=30, decimal_places=15)
    longitude = models.DecimalField(max_digits=30, decimal_places=15)

    def __str__(self):
        return str(self.district)


class Crime(models.Model):
    """
    Model to hold crime data pulled from the City of Chicago dataset
    """
    crime_id = models.IntegerField(primary_key=True)
    date = models.DateTimeField()
    block = models.CharField(max_length=255)
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    subtype = models.CharField(max_length=255)
    district = models.ForeignKey(Station)
    latitude = models.DecimalField(max_digits=30, decimal_places=15)
    longitude = models.DecimalField(max_digits=30, decimal_places=15)

    def __str__(self):
        return str(self.crime_id)
